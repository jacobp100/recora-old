import { getFormattingHints } from './locale';
import assert from 'assert';

import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';
import resolveTags from './parse/resolveTags';
import resolve from './resolve';
import { toString } from './types/types';
import { convert, convertComposite } from './types/entity';

const cartesian = commute(of);

const getDistance = pipe(
  pluck('index'),
  map(x => x ** 2),
  sum
);

const getParseOptions = pipe(
  pickBy(whereEq({ type: 'PARSE_OPTIONS' })),
  toPairs,
  map(([index, parseOption]) => (
    map(value => ({ index, value }), parseOption.value))
  ),
  cartesian,
  sortBy(getDistance),
);

const updateTagsWithParseoptions = (tags, { index, value }) =>
  update(Number(index), value, tags);

const transformParseOptions = curry((tags, parseOptions) => (
  reduce(updateTagsWithParseoptions, tags, parseOptions)
));

function getTagOptions(context) {
  return pipe(
    getParseOptions,
    map(transformParseOptions(context.tags)),
    map(tags => ({ ...context, tags })),
  )(context.tags);
}

const resolveTagOptions = pipe(
  postprocessTags,
  resolveTags,
  resolve,
);

const hasCompositeConversion = propSatisfies(Array.isArray, 'conversion');
const hasConversion = has('conversion');
const convertResult = over(
  lens(identity, assoc('result')),
  cond([
    [hasCompositeConversion, converge(convertComposite, identity, prop('conversion'), prop('result'))],
    [hasConversion, converge(convert, identity, prop('conversion'), prop('result'))],
    [T, prop('result')],
  ])
);

const resultToString = over(
  lens(identity, assoc('resultToString')),
  converge(toString, identity, prop('result')),
);

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(resolveTagOptions),
  reject(propSatisfies(isNil, 'result')),
  map(convertResult),
  reject(propSatisfies(isNil, 'result')),
  map(resultToString),
  head,
);

const assertNoTextElementInTags = tap(
  pipe(
    prop('tags'),
    pluck('type'),
    none(test(/^TEXT_/)),
    assert
  )
);

const parse = pipe(
  parseText,
  getFormattingHints,
  preprocessTags,
  assertNoTextElementInTags,
  parseTagsWithOptions,
);
export default parse;
