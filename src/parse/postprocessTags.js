import { pipe, curry, over, lensProp } from 'ramda';
import {
  TAG_UNIT_POWER_PREFIX, TAG_UNIT_POWER_SUFFIX, TAG_OPERATOR, TAG_FUNCTION, TAG_UNIT,
} from './tags';
import { trimNoop } from './tags/util';
import { SUBTRACT, DIVIDE, NEGATE } from '../math/operators';
import { mapWithAccum, mapWithAccumRight, rejectNil } from '../util';

const tagUnitPowerReciprocal = { type: TAG_UNIT_POWER_PREFIX, value: -1 };
const tagNegate = { type: TAG_OPERATOR, value: NEGATE };

function fixNaturalNotationWithPrevious(previous, tag) {
  let newTag = tag;

  if (tag.value === SUBTRACT &&
    (!previous || previous.type === TAG_OPERATOR || previous.type === TAG_FUNCTION)) {
    // Fix negative signs at start of input (-1 meters) and after operators (3 * -1 meters)
    newTag = { ...tag, ...tagNegate };
  }

  return [tag, newTag];
}

function fixNotationWithNext(next, tag) {
  let newTag = tag;

  if (tag.type === TAG_OPERATOR && next && next.type === TAG_UNIT) {
    if (tag.value === DIVIDE) {
      // Fix using / as an alias for 'per' (1 meter / second)
      newTag = { ...tag, ...tagUnitPowerReciprocal };
    } else if (tag.value === SUBTRACT) {
      // Fix any prefixed unit with a negative sign (-€5)
      newTag = { ...tag, ...tagNegate };
    }
  }

  return [tag, newTag];
}

// Can the two tag negatives be found by looking at all subtractions, and converting to a negative
// iff there are only unit tags between the subtract and the next number
const fixNaturalMathNotation = pipe(
  mapWithAccum(fixNaturalNotationWithPrevious, null),
  mapWithAccumRight(fixNotationWithNext, null)
);

const resolveUnitPowerType = curry((type, power, tag) => {
  if (tag.type === type) {
    return [tag.value, null];
  } else if (tag.type === TAG_UNIT) {
    return [1, { ...tag, power: tag.power * power }];
  }

  return [1, tag];
});

const resolveUnitPowerPrefixes = pipe(
  mapWithAccum(resolveUnitPowerType(TAG_UNIT_POWER_PREFIX), 1),
  rejectNil
);

const resolveUnitPowerSuffixes = pipe(
  mapWithAccumRight(resolveUnitPowerType(TAG_UNIT_POWER_SUFFIX), 1),
  rejectNil
);

const resolveUnitPowers = pipe(
  // Resolve 3 meters squared, 3 square meters, 3 meters per second etc.
  // Also resolves 1 meter / second when used in after fixNaturalMathNotation
  resolveUnitPowerPrefixes,
  resolveUnitPowerSuffixes
);

const postprocessTags = over(
  lensProp('tags'),
  pipe(
    fixNaturalMathNotation,
    resolveUnitPowers,
    trimNoop
  )
);
export default postprocessTags;
