export const mapWithAccum = curry((fn, initial, list) => last(mapAccum(fn, initial, list)));
export const mapWithAccumRight = curry((fn, initial, list) => last(mapAccumRight(fn, initial, list)));
export const rejectNil = reject(isNil);
export const lengthIsOne = pipe(length, equals(1));
export const notNil = complement(isNil);
export const containsNil = any(isNil);
export const noneNil = all(notNil);
export const objectEmpty = pipe(keys, isEmpty);
export const objectNotEmpty = complement(objectEmpty);
export const nilValue = always(null);
export const findPatternIndexBy = curry((patterns, array) => {
  const patternsLength = patterns.length;
  const to = array.length - patternsLength;

  outerloop: for (let i = 0; i <= to; i += 1) {
    let count = 0;

    for (let j = 0; j < patternsLength; j += 1) {
      const arrayIndex = i + count;

      if (!patterns[j](array[arrayIndex])) {
        continue outerloop;
      }

      count += 1;

      if (count === patternsLength) {
        return i;
      }
    }
  }

  return -1;
});
export const findPatternIndex = curry((comparitor, subarray, array) => {
  const subarrayLength = subarray.length;
  const to = array.length - subarrayLength + 1;

  outerloop: for (let i = 0; i < to; i += 1) {
    let count = 0;

    for (let j = 0; j < subarrayLength; j += 1) {
      const arrayIndex = i + count;

      if (!comparitor(subarray[j], array[arrayIndex])) {
        continue outerloop;
      }

      count += 1;

      if (count === subarrayLength) {
        return i;
      }
    }
  }

  return -1;
});
