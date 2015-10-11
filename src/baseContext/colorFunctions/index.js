import Color from 'color-forge';
import { isNumber, toSi } from '../../types/entity';
import { entity, percentage, color } from '../../types';
import { noneNil } from '../../util';


const input = nthArg(1);
const value = prop('value');
const inputValue = pipe(input, value);
const inputType = pipe(input, prop('type'));

const isNumberEntity = allPass([
  pipe(inputType, equals(entity.type)),
  isNumber,
]);

const isPercent = pipe(inputType, equals(percentage.type));

const percentageEntityToNumber = cond([
  [isNumberEntity, pipe(toSi, value)],
  [isPercent, pipe(inputValue, multiply(1 / 100))],
  [T, always(null)],
]);

const percentageEntityToPercentage = cond([
  [isNumberEntity, pipe(toSi, value, ifElse(lte(__, 1),
    multiply(100),
    identity,
  ))],
  [isPercent, inputValue],
  [T, always(null)],
]);

const percentageEntityToDegrees = cond([
  [isNumberEntity, inputValue], // NOT toSi, accept 180 degrees and 180
  [isPercent, pipe(inputValue, multiply(100 / 360))],
  [T, always(null)],
]);

function colorConversion(space, fn1, fn2, fn3) {
  return function colorConversionFunction(ctx, power, values) {
    if (power === 1 && values.length === 3) {
      const a = fn1(ctx, values[0]);
      const b = fn2(ctx, values[1]);
      const c = fn3(ctx, values[2]);

      const spaceValues = [a, b, c];

      if (noneNil(spaceValues)) {
        return { ...color, value: Color[space](spaceValues) };
      }
    }
    return null;
  };
}


export const rgb = colorConversion('rgb',
  percentageEntityToNumber,
  percentageEntityToNumber,
  percentageEntityToNumber,
);
export const hsl = colorConversion('hsl',
  percentageEntityToDegrees,
  percentageEntityToPercentage,
  percentageEntityToPercentage,
);
export const hsv = colorConversion('hsv',
  percentageEntityToDegrees,
  percentageEntityToPercentage,
  percentageEntityToPercentage,
);

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
