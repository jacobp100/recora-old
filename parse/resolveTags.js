import { orderOperations, operationsOrder } from '../constants';
import { lengthIsOne } from '../util';
import { entity as entityDescriptor } from '../types/descriptors';
import { baseDimensions } from '../types/entity';
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

    return append({ ...entityDescriptor, value }, values);
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

    return append(assocPath(['units', value], power, entityDescriptor), values);
  },
  NOOP: append(entityDescriptor),
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
  ), [entityDescriptor]),
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

const conversionStatements = [
  { type: 'NOOP' }, // FIXME: should be TAG_NOOP
  { type: 'TAG_UNIT' },
  { type: 'TAG_UNIT_POWER_PREFIX' },
  { type: 'TAG_UNIT_POWER_SUFFIX' },
  { type: 'TAG_OPERATOR', value: 'NEGATE' },
  { type: 'TAG_COMMA' },
];
const isConversionStatement = tag => any(whereEq(__, tag), conversionStatements);
const isNoop = whereEq({ type: 'NOOP' }); // FIXME: it's in tagutils
const notNoop = complement(isNoop);
const isComma = whereEq({ type: 'TAG_COMMA' });

const addConversionToContext = (context, conversionTagsWithNoop, tags) => {
  const units = pipe(
    reject(isNoop),
    reject(isComma),
    map(converge(createMapEntry, prop('value'), prop('power'))),
  )(conversionTagsWithNoop);

  const unitsLength = length(units);

  if (unitsLength === 0) {
    return context;
  } else if (unitsLength === 1) {
    const conversion = head(units);
    return { ...context, tags, conversion };
  }

  const allEqualDimensions = pipe(
    map(assoc('units', __, entityDescriptor)), // Get entities
    map(partial(baseDimensions, context)),
    uniq,
    length,
    equals(1),
  )(units);

  if (allEqualDimensions) {
    return { ...context, tags, conversion: units };
  }

  const conversion = mergeAll(units);
  return { ...context, tags, conversion };
};

export function findLeftConversion(context) {
  if (context.conversion) {
    return context;
  }

  const conversionTags = pipe(
    takeWhile(isConversionStatement),
    dropLastWhile(notNoop),
  )(context.tags);
  const remainingTags = drop(length(conversionTags), context.tags);

  if (isEmpty(conversionTags) || last(conversionTags).type !== 'NOOP') {
    return context;
  }

  return addConversionToContext(context, conversionTags, remainingTags);
}

export function findRightConversion(context) {
  if (context.conversion) {
    return context;
  }

  let conversionTags = takeLastWhile(isConversionStatement, context.tags);

  const precedingTag = context.tags[length(context.tags) - length(conversionTags) - 1];

  if (precedingTag && (precedingTag.type === 'TAG_NUMBER' || precedingTag.type === 'DATE_TIME')) {
    // Gathered too many tags and went into tags that would form an entity, drop some tags
    conversionTags = dropWhile(notNoop, conversionTags);
  }

  if (length(conversionTags) === 0) {
    return context;
  }

  const remainingTags = dropLast(length(conversionTags), context.tags);
  return addConversionToContext(context, conversionTags, remainingTags);
}

const resolveTags = pipe(
  findLeftConversion,
  findRightConversion,
  over(
    lens(prop('tags'), assoc('ast')),
    createASTFromTags,
  ),
);
export default resolveTags;
