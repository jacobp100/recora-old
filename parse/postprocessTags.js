import { pipe, map, mapAccum, last, isNil, reject, curry } from 'ramda';
import { fullAperture } from '../util';
import { untailTags, trimNoop } from '../utils/tagUtils';

function fixNaturalNotationWithPreviousNext([previous, tag, next]) {
  const nextIsTagUnit = next && next.type === 'TAG_UNIT';

  if (tag.type === 'TAG_OPERATOR' && next) {
    if (tag.value === 'divide' && nextIsTagUnit) {
      // Fix 1 meter / second, where / is shorthand for 'per'
      return {
        ...tag,
        type: 'TAG_UNIT_POWER_PREFIX',
        value: -1,
      };
    } else if (tag.value === 'subtract' && (!previous || previous.type === 'TAG_OPERATOR' || nextIsTagUnit)) {
      // Fix -1 meters, 3 * -1 meters, or -seconds (not sure on the last one)
      return {
        ...tag,
        type: 'TAG_NEGATIVE',
        value: null,
      };
    }
  }

  return tag;
}

const fixNaturalMathNotation = pipe(
  fullAperture(1),
  map(fixNaturalNotationWithPreviousNext)
);

const resolveUnitPowerType = curry((type, power, tag) => {
  if (tag.type === type) {
    return [tag.value, null];
  } else if (tag.type === 'TAG_UNIT') {
    return [1, { ...tag, power: tag.power * power }];
  }

  return [1, tag];
});

const cleanUpMapAccum = pipe(
  last,
  reject(isNil),
);

const resolveUnitPowerPrefixes = pipe(
  mapAccum(resolveUnitPowerType('TAG_UNIT_POWER_PREFIX'), 1),
  cleanUpMapAccum,
);

const resolveUnitPowerSuffixes = pipe(
  mapAccum(resolveUnitPowerType('TAG_UNIT_POWER_SUFFIX'), 1),
  cleanUpMapAccum,
);

const resolveUnitPowers = pipe(
  // Resolve 3 meters squared, 3 square meters, 3 meters per second etc.
  // Also resolves 1 meter / second when used in combination with fixNaturalMathNotation
  resolveUnitPowerPrefixes,
  resolveUnitPowerSuffixes,
);

// FIXME: Lens stuff
const postprocessTags = pipe(
  untailTags,
  fixNaturalMathNotation,
  resolveUnitPowers,
  trimNoop
);
export default postprocessTags;
