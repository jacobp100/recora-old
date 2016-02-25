import {
  commute, of, pipe, pluck, map, sum, whereEq, pickBy, toPairs, sortBy, addIndex, chain, filter,
  flatten, prop, converge, concat, countBy, all, partial, where, over, lens, identity, assoc, cond,
  T, equals, isNil, anyPass, reject, uniqWith, head, find,
} from 'ramda';
import { TAG_PARSE_OPTIONS } from './tags';
import { isSymbol } from './tags/util';
import parseText from './parseText';
import parseDates from './parseDates';
import preprocessTags from './preprocessTags';
import postprocessTags from './postprocessTags';
import resolveTags from './resolveTags';
import { entity, empty } from '../types';
import { toString, convert, convertComposite } from '../types/types';
import { getFormattingHints } from '../environment';
import resolve from '../resolve';
import { notNil, objectNotEmpty } from '../util';


const cartesian = commute(of);

const indexSquaredDistance = pipe(
  pluck('index'),
  map(x => Math.pow(x, 2)),
  sum
);

const isParseOption = whereEq({ type: TAG_PARSE_OPTIONS });
const getParseOptions = pipe(
  pickBy(isParseOption),
  toPairs,
  map(([index, parseOption]) => (
    map(tags => ({ index: Number(index), tags }), parseOption.value)
  )),
  cartesian,
  sortBy(indexSquaredDistance)
);

const chainIndexed = addIndex(chain);
const transformParseOptions = (tags, parseOptions) => (
  chainIndexed((tag, index) => {
    const parseOption = find(whereEq({ index }), parseOptions);

    if (parseOption) {
      return parseOption.tags;
    }
    return tag;
  })(tags)
);

const getParseOptionSymbols = pipe(
  filter(isParseOption),
  pluck('value'),
  flatten,
  filter(isSymbol)
);
const getInlineSymbols = filter(isSymbol);
const countSymbols = pipe(
  prop('tags'),
  converge(concat, [getParseOptionSymbols, getInlineSymbols]),
  countBy(prop('value'))
);

export function getTagOptions(context) { // exported for testing
  // Assert that when we get the parse options, we either include occurances of a symbol, or none
  // I.e. x^2 + x = 5 either includes both occurances of x, or neither
  const symbolCount = countSymbols(context);

  // TODO: Test!
  const noneOrAllSymbolsIncluded = pipe(
    filter(isSymbol),
    countBy(prop('value')),
    toPairs,
    all(([symbol, count]) => (count === 0 || count === symbolCount[symbol]))
  );

  return pipe(
    getParseOptions,
    map(partial(transformParseOptions, [context.tags])),
    filter(noneOrAllSymbolsIncluded),
    map(tags => ({ ...context, tags }))
  )(context.tags);
}


const resolveTagOptions = pipe(
  postprocessTags,
  resolveTags,
  resolve
);


const hasCompositeConversion = where({ conversion: Array.isArray });
const hasConversion = where({ conversion: notNil });
const result = prop('result');
const conversion = prop('conversion');

// convert and convertCompisite needs to be moved to types/types, so colours etc. can be converted
const convertResult = over(
  lens(identity, assoc('result')),
  cond([
    [hasCompositeConversion, converge(convertComposite, [identity, conversion, result])],
    [hasConversion, converge(convert, [identity, conversion, result])],
    [T, result],
  ])
);


const resultToString = over(
  lens(identity, assoc('resultToString')),
  converge(toString, [identity, result])
);


const entityWithSymbols = where({
  type: equals(entity.type),
  symbols: objectNotEmpty,
});
const resultIsNil = where({ result: isNil });
const resultIsEntityWithSymbols = where({ result: entityWithSymbols });
const irrelevantResults = anyPass([
  whereEq({ type: empty.type }),
]);
const resultIsIrrelevant = where({ result: irrelevantResults });

const parseTagsWithOptions = pipe(
  preprocessTags,
  getTagOptions,
  map(resolveTagOptions),
  reject(resultIsNil),
  reject(resultIsEntityWithSymbols),
  reject(resultIsIrrelevant),
  map(convertResult),
  reject(resultIsNil),
  uniqWith((a, b) => equals(a.result, b.result)),
  map(resultToString),
  head
);


const parseWithDates = pipe(
  parseDates,
  parseTagsWithOptions
);

const parse = pipe(
  parseText,
  getFormattingHints,
  // FIXME: Allow context to skip this step
  context => (((!context.skipDates && context.currentTime) ?
    parseWithDates(context) : null) || parseTagsWithOptions(context))
);
export default parse;
