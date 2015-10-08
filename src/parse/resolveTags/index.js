import * as tagResolvers from './tagResolvers';
import { TAG_NOOP, TAG_COMMA, TAG_UNIT, TAG_OPERATOR, TAG_OPEN_BRACKET, TAG_CLOSE_BRACKET, TAG_UNIT_POWER_PREFIX, TAG_UNIT_POWER_SUFFIX, TAG_NUMBER, TAG_FUNCTION } from '../tags';
import { isNoop, isSymbol } from '../tags/util';
import { orderOperations, operationsOrder, NEGATE } from '../../math/operators';
import { entity, funcApplication, func, miscGroup, empty, bracketGroup, operationsGroup } from '../../types';
import { baseDimensions } from '../../types/entity';
import { lengthIsOne, objectEmpty } from '../../util';

const valueTypeIsEmpty = where({
  type: equals(entity.type),
  value: isNil,
  units: objectEmpty,
  symbols: objectEmpty,
});

const valueTypeHasNilValueButHasSymbols = where({
  type: equals(entity.type),
  value: isNil,
  symbols: complement(objectEmpty),
});


const groupRemainingTags = pipe(
  reduce((values, tag) => (
    (tagResolvers[tag.type] || tagResolvers.DEFAULT)(values, tag)
  ), [entity]),
  map(ifElse(valueTypeHasNilValueButHasSymbols, assoc('value', 1), identity)),
  reject(valueTypeIsEmpty),
  cond([
    [isEmpty, always(empty)],
    [lengthIsOne, head],
    [T, assoc('groups', __, miscGroup)], // Only wrap in value group iff groups.length > 1
  ]),
);


const isFunction = whereEq({ type: TAG_FUNCTION });

function resolveTagsWithoutOperations(tags) {
  const functionIndex = findIndex(isFunction, tags);

  if (functionIndex === -1) {
    return groupRemainingTags(tags);
  }

  const funcTag = tags[functionIndex];
  const nextTag = tags[functionIndex + 1];

  if (!nextTag) {
    return groupRemainingTags(dropLast(1, tags));
  }

  const newFunc = { ...func, name: funcTag.value, power: funcTag.power };

  const tagsBefore = slice(0, functionIndex, tags);

  if (nextTag.type === bracketGroup.type) {
    const tagsAfter = pipe(
      slice(functionIndex + 2, Infinity),
      resolveTagsWithoutOperations,
    )(tags);

    const newFuncApplication = {
      ...funcApplication,
      func: newFunc,
      groups: nextTag.groups, // already resolved
    };

    return groupRemainingTags([...tagsBefore, newFuncApplication, ...tagsAfter]);
  }

  const funcArguments = slice(functionIndex + 1, Infinity, tags);
  const newFuncApplication = {
    ...funcApplication,
    func: newFunc,
    groups: [resolveTagsWithoutOperations(funcArguments)],
  };

  return groupRemainingTags([...tagsBefore, newFuncApplication]);
}


const groupOperations = reduce((operationGroup, tag) => {
  if (tag.type === TAG_OPERATOR && operationGroup.level === orderOperations[tag.value]) {
    return evolve({
      operations: append(tag.value),
      groups: append([]),
    }, operationGroup);
  }

  return evolve({
    groups: adjust(append(tag), -1),
  }, operationGroup);
});

const tagOperatorMatchesValue = value => whereEq({ type: TAG_OPERATOR, value });

function resolveOperations(startLevel, tags) {
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
      ...operationsGroup,
      groups: [[]],
      operations: [],
      level,
    }),
    evolve({ groups: map(partial(resolveOperations, level + 1)) }),
  )(tags);
}


const splitTags = reduce((tags, tag) => {
  if (tag.type === TAG_COMMA) {
    return append([tag], tags);
  }
  return adjust(append(tag), -1, tags);
}, [[]]);

const resolveTagsWithoutBrackets = pipe(
  splitTags,
  map(partial(resolveOperations, 0)),
);

const isOpenBracket = whereEq({ type: TAG_OPEN_BRACKET });

function resolveBrackets(tags) {
  let resolvedTags = tags;
  const openBracketIndex = findIndex(isOpenBracket, tags);

  if (openBracketIndex !== -1) {
    const openBracket = tags[openBracketIndex];

    const matchingCloseBracket = whereEq({
      type: TAG_CLOSE_BRACKET,
      value: openBracket.value,
    });
    let closeBracketIndex = findIndex(matchingCloseBracket, tags);

    if (closeBracketIndex === -1) {
      closeBracketIndex = Infinity;
    }

    const tagsBefore = slice(0, openBracketIndex, tags);
    const tagsInBracket = slice(openBracketIndex + 1, closeBracketIndex, tags);
    const tagsAfter = slice(closeBracketIndex + 1, Infinity, tags);

    const newBracketGroup = {
      ...bracketGroup,
      groups: resolveBrackets(tagsInBracket),
    };

    resolvedTags = [...tagsBefore, newBracketGroup, ...tagsAfter];
  }

  return resolveTagsWithoutBrackets(resolvedTags);
}


const createASTFromTags = pipe(
  resolveBrackets,
  ifElse(pipe(length, equals(1)), head, always(null)),
);

const notNoop = complement(isNoop);
const isComma = whereEq({ type: TAG_COMMA });
const conversionStatements = [
  isNoop,
  isComma,
  whereEq({ type: TAG_UNIT }),
  whereEq({ type: TAG_UNIT_POWER_PREFIX }),
  whereEq({ type: TAG_UNIT_POWER_SUFFIX }),
  whereEq({ type: TAG_OPERATOR, value: NEGATE }),
];
const isConversionStatement = anyPass(conversionStatements);


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
    map(assoc('units', __, entity)), // Get entities
    map(partial(baseDimensions, context)),
    uniq,
    lengthIsOne,
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

  if (isEmpty(conversionTags) || last(conversionTags).type !== TAG_NOOP) {
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

  if (precedingTag && (precedingTag.type === TAG_NUMBER || precedingTag.type === 'DATE_TIME')) {
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

const hasMoreThanOneTag = pipe(
  prop('tags'),
  filter(isSymbol),
  pluck('value'),
  uniq,
  length,
  gt(__, 0), // FIXME: Update to 1 (or more) when we use symbols
);
const quickResolveTags = ifElse(hasMoreThanOneTag,
  assoc('result', null),
  resolveTags,
);
export default quickResolveTags;
