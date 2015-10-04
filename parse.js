import { entity } from './types/descriptors';
import { PARSE_OPTIONS } from './tagTypes';
import { getFormattingHints } from './locale';
import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';
import resolveTags from './parse/resolveTags';
import resolve from './resolve';
import { toString } from './types/types';
import { convert, convertComposite } from './types/entity';
import { notNil, objectNotEmpty } from './util';


const cartesian = commute(of);

const indexSquaredDistance = pipe(
  pluck('index'),
  map(x => x ** 2),
  sum,
);

const getParseOptions = pipe(
  pickBy(whereEq({ type: PARSE_OPTIONS })),
  toPairs,
  map(([index, parseOption]) => (
    map(value => ({ index, value }), parseOption.value)
  )),
  cartesian,
  sortBy(indexSquaredDistance),
);

const updateTagsWithParseoptions = (tags, { index, value }) => (
  update(Number(index), value, tags)
);

const transformParseOptions = (tags, parseOptions) => (
  reduce(updateTagsWithParseoptions, tags, parseOptions)
);

function getTagOptions(context) {
  return pipe(
    getParseOptions,
    map(partial(transformParseOptions, context.tags)),
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

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(resolveTagOptions),
  reject(resultIsNil),
  reject(resultIsEntityWithSymbols),
  map(convertResult),
  reject(resultIsNil),
  map(resultToString),
  head,
);


const parse = pipe(
  parseText,
  getFormattingHints,
  preprocessTags,
  parseTagsWithOptions,
);
export default parse;
