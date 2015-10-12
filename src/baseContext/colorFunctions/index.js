import Color from 'color-forge';
import { isNumber, toSi } from '../../types/entity';
import { lighten as colorLighten, darken as colorDarken } from '../../types/color';
import { color } from '../../types';
import { isEntity, isPercentage, isColor } from '../../types/util';
import { noneNil, objectNotEmpty, objectEmpty } from '../../util';


const input = nthArg(1);
const value = prop('value');
const units = prop('units');
const inputValue = pipe(input, value);
const siValue = pipe(toSi, value);

const isNumberEntity = allPass([
  pipe(input, isEntity),
  isNumber,
]);

const isDegreesEntity = allPass([
  pipe(input, isEntity),
  pipe(input, units, objectNotEmpty),
  pipe(toSi, units, objectEmpty),
]);

const isPercent = pipe(input, isPercentage);

const as255Number = cond([
  [isNumberEntity, siValue],
  [isPercent, pipe(inputValue, multiply(255 / 100))],
  [T, always(null)],
]);

const asPercentage = cond([
  [isNumberEntity, pipe(siValue, ifElse(lte(__, 1),
    multiply(100),
    identity,
  ))],
  [isPercent, inputValue],
  [T, always(null)],
]);

const asDegrees = cond([
  [isDegreesEntity, pipe(siValue, multiply(360 / (2 * Math.PI)))],
  [isNumberEntity, pipe(siValue, ifElse(lte(__, 1),
    multiply(360),
    identity,
  ))], // NOT toSi, accept 180 degrees and 180
  [isPercent, pipe(inputValue, multiply(360 / 100))],
  [T, always(null)],
]);


function colorConversion(space, functions) {
  return function colorConversionFunction(ctx, power, values) {
    if (power === 1 && values.length === functions.length) {
      const functionValueZip = zip(functions, values);
      const spaceValues = map(([fn, spaceValue]) => fn(ctx, spaceValue), functionValueZip);

      if (noneNil(spaceValues)) {
        return { ...color, value: Color[space](spaceValues) };
      }
    }
    return null;
  };
}


export const rgb = colorConversion('rgb', [as255Number, as255Number, as255Number]);
export const hsl = colorConversion('hsl', [asDegrees, asPercentage, asPercentage]);
export const hsv = colorConversion('hsv', [asDegrees, asPercentage, asPercentage]);


function lightenDarken(fn) {
  return function lightenDarkenFunction(ctx, power, values) {
    const colorValue = values[0];

    if (power === 1 && values.length <= 2 && isColor(colorValue)) {
      const shiftValue = values[1];
      const shiftPercent = shiftValue ? asPercentage(ctx, shiftValue) : 10;

      if (shiftPercent !== null) {
        return fn(ctx, colorValue, shiftPercent / 100);
      }
    }

    return null;
  };
}

export const lighten = lightenDarken(colorLighten);
export const darken = lightenDarken(colorDarken);


export function mix(ctx, power, values) {
  const length = values.length;
  const [color1, color2, mixValue] = values;

  if (power === 1 && (length === 3 || length === 2) && isColor(color1) && isColor(color2)) {
    const mixPercent = mixValue ? asPercentage(ctx, mixValue) : 50;

    if (mixPercent !== null) {
      return { ...color, value: color1.value.mix(color2.value, mixPercent / 100) };
    }
  }

  return null;
}


function colorOperation(fn) {
  return function colorOperationFn(ctx, power, values) {
    const [color1, color2] = values;

    if (power === 1 && values.length === 2 && isColor(color1) && isColor(color2)) {
      return { ...color, value: color1.value[fn](color2.value) };
    }

    return null;
  };
}

export const screen = colorOperation('screen');
export const overlay = colorOperation('overlay');
export const dodge = colorOperation('dodge');
export const burn = colorOperation('burn');
