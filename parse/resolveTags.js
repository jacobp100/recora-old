import { mathOperations, orderOperations, operationsOrder } from '../constants';
import assert from 'assert';

// FIXME
const statementBase = {
  type: 'VALUE',
  value: null,
  units: {},
  symbols: {},
};

const tagResolvers = {
  TAG_NUMBER(out, { value }) {
    assert(typeof value === 'number');
    const lastItem = last(out.group);
    const multiplier = out.isNegative ? -1 : 1;

    if (lastItem.type === 'VALUE' && lastItem.value === null) {
      return evolve({
        group: adjust(assoc('value', value * multiplier), -1),
      }, out);
    }

    return evolve({
      group: append({ ...statementBase, value: value * multiplier }),
    }, out);
  },
  TAG_UNIT(out, { value, power }) {
    const lastItem = last(out.group);

    if (lastItem.type === 'VALUE') {
      console.log('running evolve', value);
      const adjustUnits = evolve({
        units: over(
          lensProp(value),
          pipe(
            tap(x => console.log(x)),
            // FIXME: broken here!
            defaultTo(0),
            add(power),
          ),
        ),
      }, out);

      return evolve({
        group: adjust(adjustUnits, -1),
      }, out);
    }

    return evolve({
      group: append({ ...statementBase, units: { [value]: power } }),
    }, out);
  },
  TAG_NEGATIVE: evolve({
    isNegative: not,
  }),
  NOOP: evolve({
    group: append(statementBase),
  }),
  default: identity,
};

const objectIsEmpty = pipe(keys, isEmpty);

const valueTypeIsEmpty = where({
  type: equals('VALUE'),
  value: isNil,
  units: objectIsEmpty,
  symbols: objectIsEmpty,
});

const valueTypeHasNilValueButHasSymbols = where({
  type: equals('VALUE'),
  value: isNil,
  symbols: pipe(objectIsEmpty, not),
});

const resolveTagsWithoutOperations = pipe(
  tap(tags => console.log(tags)),
  reduce((out, tag) => (
    console.log(tag)||
    (tagResolvers[tag.type] || tagResolvers.default)(out, tag)
  ), {
    group: [statementBase],
    isNegative: false,
  }),
  ifElse(prop('isNegative'), evolve({ group: append({ ...statementBase, value: -1 }) }), identity),
  prop('group'),
  map(ifElse(valueTypeHasNilValueButHasSymbols, assoc('value', 1), identity)),
  reject(valueTypeIsEmpty),
);

const groupOperations = reduce((out, tag) => {
  if (tag.type === 'TAG_OPERATOR' && out.level === orderOperations[tag.value]) {
    return evolve({
      operations: append(tag),
      groups: append([]),
    }, out);
  }

  return evolve({
    groups: adjust(append(tag), -1),
  }, out);
});

function resolveOperations(tags, startLevel = 0) {
  function tagsContainOperation(value) {
    return any(whereEq({ type: 'TAG_OPERATOR', value }), tags);
  }

  const operations = pipe(
    drop(startLevel),
    find(any(tagsContainOperation)),
  )(operationsOrder);

  if (operations) {
    const level = findIndex(operations, operationsOrder);

    return pipe(
      groupOperations({
        type: 'OPERATIONS_GROUP',
        groups: [[]],
        operations: [],
        level,
      }),
      evolve({
        groups: resolveOperations(__, level + 1),
      }),
      (operationsGroup) => {
        if (none(isNil, operationsGroup.groups)) {
          return operationsGroup;
        }

        return null;
      },
      resolveTagsWithoutOperations,
    )(tags);
  }

  return resolveTagsWithoutOperations(tags);
}

const splitTags = reduce((tags, tag) => {
  if (tag.type === 'TAG_COMMA') {
    return append([tag], tags);
  }
  return adjust(append(tag), -1, tags);
}, [[]]);

const isOpenBracket = propEq('type', 'TAG_OPEN_BRACKET');

function resolveBrackets(context, tags) {
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
    const tagsInBracket = slice(openBracketIndex, closeBracketIndex, tags);
    const tagsAfter = slice(closeBracketIndex, Infinity, tags);

    const bracketGroup = {
      type: 'TAG_BRACKETS',
      tags: resolveBrackets(tagsInBracket),
    };

    resolvedTags = [...tagsBefore, bracketGroup, ...tagsAfter];
  }

  return pipe(
    splitTags,
    map(resolveOperations)
  )(resolvedTags); // FIXME: hoist
}

function createASTFromTags(context, tags) {
  return resolveBrackets(context, tags);
}

export default function resolveTags(context) {
  const { tags } = context;
  const { tags: tagsWithoutConversions, conversion } = { tags }; // get metadata
  const ast = createASTFromTags(context, tagsWithoutConversions);
  console.log(ast);
  return null;
}
