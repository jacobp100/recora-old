import { __, curry, pipe, merge, repeat, aperture, concat, mapObj, assoc } from 'ramda';

const callWith = curry((obj, fn) => fn(obj));

export const mergeVia = curry((fn, obj) => merge(obj, fn(obj)));
export const mergeOver = curry((fnObj, obj) => merge(obj, mapObj(callWith(obj), fnObj)));
export const mergeProp = curry((prop, fn, obj) => assoc(prop, fn(obj), obj));

/**
Transforms an array into an array of equal length where each element is an array consisting of `left` elements to the left, the current element, and `right` elements to the right

fullAperture(1, 1) will transform the array [a, b, c] into [[undefined, a, b], [a, b, c], [b, c, undefined]]
*/
export const fullAperture = curry((n, array) => {
  const padding = repeat(undefined, Math.floor(n / 2));
  const paddedArray = pipe(
    concat(padding),
    concat(__, padding)
  )(array);
  return aperture(n, paddedArray);
});

// var lens = R.lens(R.prop('x'), R.assoc('y'));
// R.over(lens, R.divide(R.__, 2), { x: 2, y: 3, a: 5}); // Sets y to x / 2
