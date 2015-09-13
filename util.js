import { curry, map } from 'lodash-fp';

export function callOwn(key, args = []) {
  return function doCallOwn(...extraArgs) {
    return this[key](...args, ...extraArgs);
  };
}

export function bindOwn(lodashFn, ...args) {
  return function doBindOwn(...data) {
    const boundArgs = map(arg => (
      (typeof arg === 'function') ? arg.bind(this) : arg
    ))(args);
    return lodashFn(...boundArgs)(...data);
  };
}

/**
Transforms an array into an array of equal length where each element is an array consisting of `left` elements to the left, the current element, and `right` elements to the right

withPreviousNextElements(1, 1) will transform the array [a, b, c] into [[undefined, a, b], [a, b, c], [b, c, undefined]]
*/
const withPreviousNextElements = curry((left, right, array) => {
  const length = left + right + 1;
  const out = [];

  for (let i = 0, len = array.length; i < len; i++) {
    const value = new Array(length);

    for (let j = i - left, k = 0; k < length; j++, k++) {
      value[k] = array[j];
    }

    out[i] = value;
  }

  return out;
});
export { withPreviousNextElements };
