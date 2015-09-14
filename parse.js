import { map, flow, pick, matches, pluck, sum, sortBy, reduce, reject, isNull, first, transform, pairs, curry, all, negate, startsWith } from 'lodash-fp';
import { bindOwn } from './util';
import assert from 'assert';

import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';

function cartesian(array) {
  // https://gist.github.com/FestivalBobcats/1323387
  return reduce((mtrx, vals) => (
    reduce((out, val) => (
      out.concat(map(row => row.concat(val))(mtrx))
    ), [])(vals)
  ), [[]])(array);
}

const getDistance = flow(
  pluck('index'),
  map(x => x ** 2),
  sum()
);

const getParseOptions = flow(
  pick(matches({ type: 'parse-options' })),
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

const parseTags = flow(
  getTagOptions,
  bindOwn(map, postprocessTags),
  reject(isNull()),
  first
);

const noTextElementInTags = flow(
  pluck('type'),
  all(negate(startsWith('TEXT_')))
);

export default function parse(text) {
  const tagsWithHints = parseText.call(this, text);
  const { tags: tagsWithoutHints, hints } = this.getFormattingHints(tagsWithHints);
  const preprocessedTags = preprocessTags.call(this, tagsWithoutHints);

  assert(noTextElementInTags(preprocessedTags));

  const output = parseTags.call(this, preprocessedTags);

  return output;

  // if (output !== null) {
  //   return output.toString(hints);
  // }
  // return null;
}
