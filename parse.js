// import { map, reduce, pipe, concat, append, whereEq, update, sortBy, pickBy, toPairs, pluck, sum, curry, reject, isNil, head, prop, none, test, tap } from 'ramda';

import { getFormattingHints, entityToString } from './locale';
import assert from 'assert';

import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';
import resolveTags from './parse/resolveTags';
import resolve from './resolve';

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

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(resolveTagOptions),
  reject(isNil),
  reject(propSatisfies(isNil, 'result')),
  head
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
  over(
    lens(prop('result'), assoc('resultToString')),
    entityToString,
  ),
);
export default parse;
