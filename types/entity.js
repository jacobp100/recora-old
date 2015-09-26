import unitsDerived from '../data/unitsDerived';
import { getUnitValue, getSiUnit } from '../locale';

const base = {
  type: 'ENTITY',
  value: null,
  units: {},
  symbols: {},
};
export default base;

const notNil = complement(isNil);
const sumLastElementsInPairs = pipe(map(last), sum);


const getUnitType = pipe(
  getUnitValue,
  ifElse(isNil, always(null), prop('type')),
);

export const resolveDimensionlessUnits = (ctx, value) => pipe(
  prop('units'),
  pickBy((power, unit) => !getUnitType(ctx, unit)),
  toPairs,
  reduce((out, [unit, power]) => {
    const unitValue = getUnitValue(ctx, unit).base ** power;

    return evolve({
      value: multiply(unitValue),
      units: omit([unit]),
    }, out);
  }, value),
)(value);


export const dimensions = (context, value) => pipe(
  prop('units'),
  toPairs,
  groupBy(([unit]) => {
    const unitValue = getUnitValue(context, unit);
    return unitValue ? String(unitValue.type) : unit;
  }),
  omit(['undefined']),
  mapObj(sumLastElementsInPairs),
  pickBy(notNil),
)(value);

const derivedUnitsForType = ifElse(
  has(__, unitsDerived),
  pipe(prop(__, unitsDerived), toPairs),
  (type) => ([[type, 1]])
); // FIXME: Test
// function derivedUnitsForType(type) {
//   const derivedUnit = unitsDerived[type];
//
//   if (derivedUnit) {
//     return toPairs(derivedUnit);
//   }
//   return [[type, 1]];
// }

export const baseDimensions = pipe(
  dimensions,
  toPairs,
  chain(([type, value]) => (
    map(adjust(multiply(value), -1), derivedUnitsForType(type))
  )),
  groupBy(head),
  mapObj(sumLastElementsInPairs),
  pickBy(notNil),
);

function getSiUnits(ctx, value) {
  return pipe(
    dimensions,
    toPairs,
    map(adjust(partial(getSiUnit, ctx), 0)),
    fromPairs,
  )(ctx, value);
}

export const convert = (ctx, units, value) => assoc('units', units, value); // FIXME!

export function toSi(ctx, value) {
  const resolvedValue = resolveDimensionlessUnits(ctx, value);
  return convert(ctx, getSiUnits(ctx, resolvedValue), resolvedValue);
}
