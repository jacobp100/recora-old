import { map, pipe, pickBy, whereEq, pluck, sum, sortBy, reduce, reject, isNil, first, transform, pairs, curry, none, test, prop, tap, append, concat } from 'ramda';
import { getFormattingHints } from './locale';
import assert from 'assert';

import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';

const cartesian = reduce((matrix, options) => (
  reduce((out, option) => (
    concat(
      out,
      map(append(option), matrix)
    )
  ), [], options)
), [[]]);

const getDistance = pipe(
  pluck('index'),
  map(x => x ** 2),
  sum()
);

const getParseOptions = pipe(
  pickBy(whereEq({ type: 'PARSE_OPTIONS' })),
  pairs,
  map(([index, parseOption]) => (
    map(value => ({ index, value }), parseOption.value))
  ),
  cartesian,
  sortBy(getDistance)
);

function assignValueToTags(tags, { index, value }) {
  tags[index] = value;
}

const transformParseOptions = curry((tags, parseOptions) => (
  transform(assignValueToTags, [...tags], parseOptions)
));

function getTagOptions(context) {
  const { tags } = context;

  return pipe(
    getParseOptions,
    map(transformParseOptions(tags)),
    map(resolvedTags => ({ ...context, tags: resolvedTags })),
  )(context.tags);
}

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(postprocessTags),
  reject(isNil),
  first
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
  console.log.bind(console, 1),
  parseTagsWithOptions,
);
export default parse;
