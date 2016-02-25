import { map, pipe, remove, insert, reduce, __, over, lensProp } from 'ramda';
import { singularize } from './pluralization';
import { TAG_OPERATOR, TAG_SYMBOL, TAG_NUMBER, TAG_NOOP } from '../../../parse/tags';
import { MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY } from '../../../math/operators';
import separatedUnits from '../../../data/en/separatedUnits';
import { findPatternIndex } from '../../../util';

const unitPowerPrefixes = {
  per: -1,
  square: 2,
  cubic: 3,
};

const unitPowerSuffixes = {
  squared: 2,
  cubed: 3,
};

function resolveUnitPowersAndAmbiguitiesMapFn(tag) {
  if (!tag) {
    return tag;
  }

  const value = tag[0];
  const { start, end } = tag;

  if (value === 'a') {
    return {
      type: 'TAG_PARSE_OPTIONS',
      value: [
        [{ type: TAG_SYMBOL, value: 'a', power: 1, start, end }],
        [{ type: TAG_NUMBER, value: 1, start, end }],
        [{ type: TAG_NOOP, start, end }],
      ],
    };
  } else if (value === 'by') {
    return {
      type: 'TAG_PARSE_OPTIONS',
      value: [
        [{ type: TAG_OPERATOR, value: MULTIPLY_COND_DIMENSIONS_LENGTH_ONLY, start, end }],
        [{ type: TAG_SYMBOL, value: 'by', power: 1, start, end }],
        [{ type: TAG_NOOP, start, end }],
      ],
    };
  } else if (unitPowerPrefixes[value]) {
    return { type: 'TAG_UNIT_POWER_PREFIX', value: unitPowerPrefixes[value], start, end };
  } else if (unitPowerSuffixes[value]) {
    return { type: 'TAG_UNIT_POWER_SUFFIX', value: unitPowerSuffixes[value], start, end };
  }
  return tag;
}
const resolveUnitPowersAndAmbiguities = map(resolveUnitPowersAndAmbiguitiesMapFn);

function resolveSeparatedUnitsReducerFn(tags, { value, words }) {
  const ind = findPatternIndex((word, tag) => (
    tag && tag[0] && (singularize(tag[0]).toLowerCase() === word.toLowerCase())
  ), words, tags);

  if (ind === -1) {
    return tags;
  }

  const unitDescriptor = {
    type: 'TAG_UNIT',
    power: 1,
    value,
    start: tags[ind].start,
    end: tags[ind + words.length - 1].end,
  };

  return pipe(
    remove(ind, words.length),
    insert(ind, unitDescriptor)
    // partialRight(resolveSeparatedUnitsReducerFn, [{ value, words }]),
  )(tags);
}
const resolveSeparatedUnits = reduce(resolveSeparatedUnitsReducerFn, __, separatedUnits);

const preprocessTags = over(
  lensProp('tags'),
  pipe(
    resolveUnitPowersAndAmbiguities,
    resolveSeparatedUnits
  )
);
export default preprocessTags;
