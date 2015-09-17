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
  pickBy(whereEq({ type: 'parse-options' })),
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

function getTagOptions(tags) {
  const parseOptions = getParseOptions.call(this, tags);
  return map(transformParseOptions(tags))(parseOptions);
}

const parseTagsWithOptions = pipe(
  getTagOptions,
  postprocessTags,
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
  tap(console.log.bind(console)),
  assertNoTextElementInTags,
  parseTagsWithOptions
);
export default parse;
