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
export function findPatternIndex(comparitor, subarray, array) {
  const subarrayLength = subarray.length;
  const to = array.length;

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
}
