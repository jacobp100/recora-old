import { TAG_PARSE_OPTIONS } from './tags';
import { isSymbol } from './tags/util';
import parseText from './parseText';
import preprocessTags from './preprocessTags';
import postprocessTags from './postprocessTags';
import resolveTags from './resolveTags';
import baseContext from '../baseContext';
import { entity } from '../types';
import { toString } from '../types/types';
import { convert, convertComposite } from '../types/entity';
import { getFormattingHints } from '../locale';
import resolve from '../resolve';
import { notNil, objectNotEmpty } from '../util';


const cartesian = commute(of);

const indexSquaredDistance = pipe(
  pluck('index'),
  map(x => x ** 2),
  sum,
);

const isParseOption = whereEq({ type: TAG_PARSE_OPTIONS });
const getParseOptions = pipe(
  pickBy(isParseOption),
  toPairs,
  map(([index, parseOption]) => (
    map(tags => ({ index: Number(index), tags }), parseOption.value)
  )),
  cartesian,
  sortBy(indexSquaredDistance),
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
  filter(isSymbol),
);
const getInlineSymbols = filter(isSymbol);
const countSymbols = pipe(
  prop('tags'),
  converge(concat, getParseOptionSymbols, getInlineSymbols),
  countBy(prop('value')),
);

function getTagOptions(context) {
  // Assert that when we get the parse options, we either include occurances of a symbol, or none
  // I.e. x^2 + x = 5 either includes both occurances of x, or neither
  const symbolCount = countSymbols(context);

  // TODO: Test!
  const noneOrAllSymbolsIncluded = pipe(
    filter(isSymbol),
    countBy(prop('value')),
    toPairs,
    all(([symbol, count]) => (count === 0 || count === symbolCount[symbol])),
  );

  return pipe(
    getParseOptions,
    map(partial(transformParseOptions, context.tags)),
    filter(noneOrAllSymbolsIncluded),
    map(tags => ({ ...context, tags })),
  )(context.tags);
}


const resolveTagOptions = pipe(
  postprocessTags,
  resolveTags,
  resolve,
);


const hasCompositeConversion = where({ conversion: Array.isArray });
const hasConversion = where({ conversion: notNil });
const result = prop('result');
const conversion = prop('conversion');

const convertResult = over(
  lens(identity, assoc('result')),
  cond([
    [hasCompositeConversion, converge(convertComposite, identity, conversion, result)],
    [hasConversion, converge(convert, identity, conversion, result)],
    [T, result],
  ]),
);


const resultToString = over(
  lens(identity, assoc('resultToString')),
  converge(toString, identity, result),
);


const entityWithSymbols = where({
  type: equals(entity.type),
  symbols: objectNotEmpty,
});
const resultIsNil = where({ result: isNil });
const resultIsEntityWithSymbols = where({ result: entityWithSymbols });
const oneContext = pipe(length, equals(1));
const multipleContexts = pipe(length, gt(1));

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(resolveTagOptions),
  reject(resultIsNil),
  reject(resultIsEntityWithSymbols),
  map(convertResult),
  reject(resultIsNil),
  uniqWith((a, b) => equals(a.result, b.result)),
  map(resultToString),
  cond([
    [oneContext, head],
    [multipleContexts, always({ error: 'ambiguous result', ...baseContext })],
    [isEmpty, always({ error: 'no result', ...baseContext })],
  ]),
);


const parse = pipe(
  parseText,
  getFormattingHints,
  preprocessTags,
  parseTagsWithOptions,
);
export default parse;
