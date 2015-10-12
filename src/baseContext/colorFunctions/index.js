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
  [isNumberEntity, pipe(toSi, value)],
  [isPercent, pipe(inputValue, multiply(255 / 100))],
  [T, always(null)],
]);

const asPercentage = cond([
  [isNumberEntity, pipe(toSi, value, ifElse(lte(__, 1),
    multiply(100),
    identity,
  ))],
  [isPercent, inputValue],
  [T, always(null)],
]);

const asDegrees = cond([
  [isDegreesEntity, pipe(toSi, value, multiply(360 / (2 * Math.PI)))],
  [isNumberEntity, pipe(toSi, value, ifElse(lte(__, 1),
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
      const shiftPercent = values[1] ? asPercentage(ctx, values[1]) : 10;
      return fn(ctx, colorValue, shiftPercent / 100);
    }

    return null;
  };
}

export const lighten = lightenDarken(colorLighten);
export const darken = lightenDarken(colorDarken);

// export function darken(colour, amount) {
//   var value = Number(amount.toSi());
//
//   if (!isNaN(value)) {
//     return new Colour({ value: colour.value.darken(value) });
//   } else {
//     return null;
//   }
// }
// export function lighten(colour, amount) {
//   var value = Number(amount.toSi());
//
//   if (!isNaN(value)) {
//     return new Colour({ value: colour.value.lighten(value) });
//   } else {
//     return null;
//   }
// }
// export function mix(c1, c2, amount) {
//   var value = NaN;
//
//   if (amount && amount.type === 'statement') {
//     value = Number(amount.toSi());
//   }
//
//   if (amount === undefined) {
//     value = 0.5;
//   }
//
//   if (c1 && c2 && !isNaN(value)) { // amount can default to 0.5
//     return new Colour({ value: c1.value.mix(c2.value, value) });
//   } else {
//     return null;
//   }
// }
// // add: reduceValuesByOperator('add'),
// // subtract: reduceValuesByOperator('subtract'),
// // multiply: reduceValuesByOperator('multiply'),
// // divide: reduceValuesByOperator('divide'),
// // screen: colourOperation('screen'),
// // overlay: colourOperation('overlay'),
// // dodge: colourOperation('dodge'),
// // burn: colourOperation('burn'),
//
//
//
// function reduceValuesByOperator(operator) {
//   return function(...values) {
//     return _.reduce(values, function(out, value) {
//       if (out !== null) {
//         return out[operator](value);
//       } else {
//         return null;
//       }
//     });
//   };
// }
//
// function colourOperation(operation) {
//   return function(c1, c2) {
//     if (c1 && c1.type === 'colour' && c2 && c2.type === 'colour') {
//       return new Colour({ value: c1.value[operation](c2.value) });
//     } else {
//       return null;
//     }
//   };
// }
//
// function valueOfUnit(unit) {
//   var unitObject = { [unit]: 1 };
//
//   return function(statement) {
//     var value = statement.convert(unitObject);
//
//     if (value) {
//       return value.value;
//     } else {
//       return null;
//     }
//   };
// }
