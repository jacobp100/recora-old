import { pipe, mapAccum, mapAccumRight, last, isNil, reject, curry } from 'ramda';
import { untailTags, trimNoop } from '../utils/tagUtils';

const mapWithAccum = pipe(
  mapAccum,
  last
);

const mapWithAccumRight = pipe(
  mapAccumRight,
  last
);

const rejectNil = reject(isNil);

const tagUnitPowerPrefix = {
  type: 'TAG_UNIT_POWER_PREFIX',
  value: -1,
};

const tagNegative = {
  type: 'TAG_NEGATIVE',
  value: null,
};

function fixNotationWithNext(next, tag) {
  let newTag;

  if (tag.type === 'TAG_OPERATOR' && next && next.type === 'TAG_UNIT') {
    if (tag.value === 'divide') {
      // Fix 1 meter / second, where / is shorthand for 'per'
      newTag = { ...tag, ...tagUnitPowerPrefix };
    } else if (tag.value === 'subtract') {
      // Fix -seconds (can't remember why)
      newTag = { ...tag, ...tagNegative };
    }
  }

  return [tag, newTag];
}

function fixNaturalNotationWithPrevious(previous, tag) {
  let newTag = tag;

  if (tag.value === 'subtract' && (!previous || previous.type === 'TAG_OPERATOR')) {
    // Fix -1 meters, 3 * -1 meters
    newTag = { ...tag, ...tagNegative };
  }

  return [tag, newTag];
}

const fixNaturalMathNotation = pipe(
  mapWithAccum(fixNaturalNotationWithPrevious, null),
  mapWithAccumRight(fixNotationWithNext, null),
);

const resolveUnitPowerType = curry((type, power, tag) => {
  if (tag.type === type) {
    return [tag.value, null];
  } else if (tag.type === 'TAG_UNIT') {
    return [1, { ...tag, power: tag.power * power }];
  }

  return [1, tag];
});

const resolveUnitPowerPrefixes = pipe(
  mapWithAccum(resolveUnitPowerType('TAG_UNIT_POWER_PREFIX'), 1),
  rejectNil,
);

const resolveUnitPowerSuffixes = pipe(
  mapWithAccum(resolveUnitPowerType('TAG_UNIT_POWER_SUFFIX'), 1),
  rejectNil,
);

const resolveUnitPowers = pipe(
  // Resolve 3 meters squared, 3 square meters, 3 meters per second etc.
  // Also resolves 1 meter / second when used in combination with fixNaturalMathNotation
  resolveUnitPowerPrefixes,
  resolveUnitPowerSuffixes,
);

const postprocessTags = pipe(
  untailTags,
  fixNaturalMathNotation,
  resolveUnitPowers,
  trimNoop
);
export default postprocessTags;
