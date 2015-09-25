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

export function dimensions(context, value) {
  return pipe(
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
}

function derivedUnitsForType(type) {
  const derivedUnit = unitsDerived[type];

  if (derivedUnit) {
    return toPairs(derivedUnit);
  }
  return [[type, 1]];
}

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
  return convert(ctx, getSiUnits(ctx, value), value);
}
