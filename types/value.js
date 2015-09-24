import unitsDerived from '../data/unitsDerived';
import { getUnitValue, getSiUnit } from '../locale';

const base = {
  type: 'VALUE',
  value: null,
  units: {},
  symbols: {},
};
export default base;

const notNil = complement(isNil);
const sumLastElementsInPairs = pipe(map(last), sum);

function dimensions(context, value) {
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

const baseDimensions = pipe(
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

const convert = (ctx, units, value) => assoc('units', units, value); // FIXME!

function toSi(ctx, value) {
  return convert(ctx, getSiUnits(ctx, value), value);
}


const isZero = propEq('value', 0);
const valueNil = propEq(isNil, 'value');
const toNil = always(null);

const context = nthArg(0);
const a = nthArg(1);
const aIsZero = pipe(a, isZero);
const aValueNil = pipe(a, valueNil);
const aUnits = pipe(a, prop('units'));
const aSymbols = pipe(a, prop('symbols'));
const aBaseDimensions = converge(baseDimensions, context, a);
const aToSi = converge(toSi, context, a);
const b = nthArg(2);
const bIsZero = pipe(b, isZero);
const bValueNil = pipe(b, valueNil);
const bUnits = pipe(b, prop('units'));
const bSymbols = pipe(b, prop('symbols'));
const bBaseDimensions = converge(baseDimensions, context, b);
const bToSi = converge(toSi, context, b);

const eitherValueNil = either(aValueNil, bValueNil);
const symbolsDiffer = converge(pipe(equals, not), aSymbols, bSymbols);
const unitsMatch = converge(equals, aUnits, bUnits);
const baseDimensionsMatch = converge(equals, aBaseDimensions, bBaseDimensions);


function addMathFactory(sign) {
  const bySign = multiply(sign);
  const performAddMath = (v1, v2) => ({ ...v1, value: v1.value + bySign(v2.value) });

  return cond([
    [eitherValueNil, toNil],
    [bIsZero, a],
    [aIsZero, pipe(b, evolve({ value: bySign }))],
    [symbolsDiffer, toNil],
    [unitsMatch, converge(performAddMath, a, b)],
    [baseDimensionsMatch, converge(performAddMath, aToSi, bToSi)],
    [T, toNil],
  ]);
}

export const add = addMathFactory(1);
export const subtract = addMathFactory(-1);

const s1 = { ...base, value: 5, units: { meter: 1 } };
const s2 = { ...base, value: 7, units: { yard: 1 } };
console.log(add({}, s1, s2));
