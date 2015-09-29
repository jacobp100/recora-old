import { orderOperations, operationsOrder } from '../constants';
import { lengthIsOne } from '../util';
import entityBase from '../types/entity';
import assert from 'assert';

const miscGroupBase = {
  type: 'MISC_GROUP',
  groups: null,
};

const empty = {
  type: 'EMPTY',
  value: null,
};

const tagResolvers = {
  TAG_NUMBER(values, { value }) {
    assert(typeof value === 'number');
    const lastItem = last(values);

    if (lastItem.type === 'ENTITY' && lastItem.value === null) {
      return adjust(assoc('value', value), -1, values);
    }

    return append({ ...entityBase, value }, values);
  },
  TAG_UNIT(values, { value, power }) {
    // This code is almost identical for symbols (s/unit/symbol/g)
    const lastItem = last(values);

    if (lastItem.type === 'ENTITY') {
      return adjust(evolve({
        units: over(
          lensProp(value),
          pipe(
            defaultTo(0),
            add(power),
          ),
        ),
      }), -1, values);
    }

    return append(assocPath(['units', value], power, entityBase), values);
  },
  NOOP: append(entityBase),
  BRACKETS_GROUP: flip(append),
  default: identity,
};

const objectIsEmpty = pipe(keys, isEmpty);

const valueTypeIsEmpty = where({
  type: equals('ENTITY'),
  value: isNil,
  units: objectIsEmpty,
  symbols: objectIsEmpty,
});

const valueTypeHasNilValueButHasSymbols = where({
  type: equals('ENTITY'),
  value: isNil,
  symbols: complement(objectIsEmpty),
});

const resolveTagsWithoutOperations = pipe(
  reduce((values, tag) => (
    (tagResolvers[tag.type] || tagResolvers.default)(values, tag)
  ), [entityBase]),
  map(ifElse(valueTypeHasNilValueButHasSymbols, assoc('value', 1), identity)),
  reject(valueTypeIsEmpty),
  cond([
    [isEmpty, always(empty)],
    [lengthIsOne, head],
    [T, assoc('groups', __, miscGroupBase)], // Only wrap in value group iff groups.length > 1
  ]),
);

const groupOperations = reduce((operationGroup, tag) => {
  if (tag.type === 'TAG_OPERATOR' && operationGroup.level === orderOperations[tag.value]) {
    return evolve({
      operations: append(tag.value),
      groups: append([]),
    }, operationGroup);
  }

  return evolve({
    groups: adjust(append(tag), -1),
  }, operationGroup);
});

const tagOperatorMatchesValue = pipe(
  assoc('value', __, { type: 'TAG_OPERATOR' }),
  whereEq,
);

const resolveOperations = curry((startLevel, tags) => {
  const tagsContainOperation = pipe(
    tagOperatorMatchesValue,
    any(__, tags),
  );

  const operations = pipe(
    drop(startLevel),
    find(any(tagsContainOperation)),
  )(operationsOrder);

  if (!operations) {
    return resolveTagsWithoutOperations(tags);
  }

  const level = indexOf(operations, operationsOrder);

  return pipe(
    groupOperations({
      type: 'OPERATIONS_GROUP',
      groups: [[]],
      operations: [],
      level,
    }),
    evolve({ groups: map(resolveOperations(level + 1)) }),
  )(tags);
});

const splitTags = reduce((tags, tag) => {
  if (tag.type === 'TAG_COMMA') {
    return append([tag], tags);
  }
  return adjust(append(tag), -1, tags);
}, [[]]);

const resolveTagsWithoutBrackets = pipe(
  splitTags,
  map(resolveOperations(0)),
);

const isOpenBracket = propEq('type', 'TAG_OPEN_BRACKET');

function resolveBrackets(tags) {
  let resolvedTags = tags;
  const openBracketIndex = findIndex(isOpenBracket, tags);

  if (openBracketIndex !== -1) {
    const openBracket = tags[openBracketIndex];

    const matchingCloseBracket = whereEq({
      type: 'TAG_CLOSE_BRACKET',
      value: openBracket.value,
    });
    let closeBracketIndex = findIndex(matchingCloseBracket, tags);

    if (closeBracketIndex === -1) {
      closeBracketIndex = Infinity;
    }

    const tagsBefore = slice(0, openBracketIndex, tags);
    const tagsInBracket = slice(openBracketIndex + 1, closeBracketIndex, tags);
    const tagsAfter = slice(closeBracketIndex + 1, Infinity, tags);

    const bracketGroup = {
      type: 'BRACKETS_GROUP',
      groups: resolveBrackets(tagsInBracket),
    };

    resolvedTags = [...tagsBefore, bracketGroup, ...tagsAfter];
  }

  return resolveTagsWithoutBrackets(resolvedTags);
}

const createASTFromTags = pipe(
  resolveBrackets,
  ifElse(pipe(length, equals(1)), head, always(null)),
);

const resolveTags = pipe(
  // FIXME: get conversion and remove conversion tags
  over(
    lens(prop('tags'), assoc('ast')),
    createASTFromTags,
  ),
);
export default resolveTags;
