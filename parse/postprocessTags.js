import { pipe, map, reduce, prop } from 'ramda';
import { fullAperture } from '../util';
import { untailTags, trimNoop } from '../utils/tagUtils';

function fixNotationWithPreviousNext([previous, tag, next]) {
  const nextIsTagUnit = next && next.type === 'tag-unit';

  if (tag.type === 'tag-operator' && next) {
    if (tag.value === 'divide' && nextIsTagUnit) {
      // Fix 1 meter / second
      return {
        ...tag,
        type: 'tag-unit-power',
        value: -1,
      };
    } else if (tag.value === 'subtract' && (!previous || previous.type === 'tag-operator' || nextIsTagUnit)) {
      // Fix -1 meters, 3 * -1 meters
      return {
        ...tag,
        type: 'tag-negative',
        value: null,
      };
    }
  }

  return tag;
}

function resolveUnitPower({ unitPower, tags }, tag) {
  if (tag.type === 'tag-unit-power') {
    return {
      tags,
      unitPower: tag.value,
    };
  }

  const newTag = { ...tag };

  if (tag.type === 'tag-unit') {
    newTag.unitPower = unitPower;
  }

  return {
    tags: [...tags, newTag],
    unitPower: 1,
  };
}

const fixNaturalMathNotation = pipe(
  fullAperture(1),
  map(fixNotationWithPreviousNext)
);

const resolveUnitPowers = pipe(
  reduce(resolveUnitPower, {
    unitPower: 1,
    tags: [],
  }),
  prop('tags')
);

const postprocessTags = pipe(
  untailTags,
  fixNaturalMathNotation,
  resolveUnitPowers,
  trimNoop
);
export default postprocessTags;
