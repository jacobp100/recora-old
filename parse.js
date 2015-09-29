// import { map, reduce, pipe, concat, append, whereEq, update, sortBy, pickBy, toPairs, pluck, sum, curry, reject, isNil, head, prop, none, test, tap } from 'ramda';

import { getFormattingHints, entityToString } from './locale';
import assert from 'assert';

import parseText from './parse/parseText';
import preprocessTags from './parse/preprocessTags';
import postprocessTags from './parse/postprocessTags';
import resolveTags from './parse/resolveTags';
import resolve from './resolve';
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

const convertResult = (context) => {
  const { conversion } = context;

  if (conversion) {
    let result;

    if (Array.isArray(conversion)) {
      result = convertComposite(context, context.conversion, context.result);
    } else {
      result = convert(context, context.conversion, context.result);
    }

    return { ...context, result };
  }
  return context;
};

const parseTagsWithOptions = pipe(
  getTagOptions,
  map(resolveTagOptions),
  reject(isNil),
  reject(propSatisfies(isNil, 'result')),
  map(convertResult),
  map(over(
    lens(prop('result'), assoc('resultToString')),
    entityToString, // FIXME
  )),
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
