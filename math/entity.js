import entity, { baseDimensions, toSi } from '../types/entity';

// FIXME: should perform[Add|Multiply|Exponent]Math take a context in the same parameter, and we can converge the a/b lhs/rhs?

const notNil = complement(isNil);
const sumLastElementsInPairs = pipe(map(last), sum);

const isZero = propEq('value', 0);
const valueNil = propEq(isNil, 'value');
const toNil = always(null);
const toZeroEntity = always({ ...entity, value: 0 });

const sign = nthArg(0);
const context = nthArg(1);
const a = nthArg(2);
const aIsZero = pipe(a, isZero);
const aValueNil = pipe(a, valueNil);
const aUnits = pipe(a, prop('units'));
const aUnitKeys = pipe(aUnits, keys);
const aUnitKeysLength = pipe(aUnitKeys, length);
const aSymbols = pipe(a, prop('symbols'));
const aBaseDimensions = converge(baseDimensions, context, a);
const aToSi = converge(toSi, context, a);

const b = nthArg(3);
const rhsIsZero = pipe(b, isZero);
const rhsValueNil = pipe(b, valueNil);
const bUnits = pipe(b, prop('units'));
const bUnitKeys = pipe(bUnits, keys);
const bUnitKeysLength = pipe(bUnitKeys, length);
const bSymbols = pipe(b, prop('symbols'));
const bBaseDimensions = converge(baseDimensions, context, b);
const bToSi = converge(toSi, context, b);
const bHasUnits = pipe(bUnitKeys, isEmpty);
const bHasSymbols = pipe(bSymbols, keys, length);
const bNotPureNumericEntity = complement(either(bHasUnits, bHasSymbols));

const eitherIsZero = either(aIsZero, rhsIsZero);
const eitherValueNil = either(aValueNil, rhsValueNil);
const symbolsDiffer = converge(pipe(equals, not), aSymbols, bSymbols);
const unitsMatch = converge(equals, aUnits, bUnits);
const baseDimensionsMatch = converge(equals, aBaseDimensions, bBaseDimensions);


const bySign = (direction, v1) => ({ ...v1, value: v1.value * direction });
const performAddMath = (direction, v1, v2) => ({ ...v1, value: v1.value + v2.value * direction });
// (sign: (1, -1), context: Context, lhs: Entity, rhs: Entity) => Entity
const abstractMathAdd = cond([
  [eitherValueNil, toNil],
  [rhsIsZero, a],
  [aIsZero, converge(bySign, sign, b)],
  [symbolsDiffer, toNil],
  [unitsMatch, converge(performAddMath, sign, a, b)],
  [baseDimensionsMatch, converge(performAddMath, sign, aToSi, bToSi)],
  [T, toNil],
]);


const overlapLength = pipe(
  converge(intersection, bUnitKeys, aUnitKeys),
  length
);
const lhsAndRhsKeysLengthEqualsOverlapKeysLength = both(
  equals(nthArg(0), nthArg(1)),
  equals(nthArg(0), nthArg(2))
);
const needConversion = converge(ifElse(
    lhsAndRhsKeysLengthEqualsOverlapKeysLength, T, F
), overlapLength, aUnitKeysLength, bUnitKeysLength);

const lhsUnitPairs = pipe(nthArg(0), toPairs);
const lhsUnits = pipe(nthArg(0), prop('units'));
const lhsSymbols = pipe(nthArg(0), prop('symbols'));
const rhsUnitPairs = pipe(nthArg(1), toPairs);
const rhsUnits = pipe(nthArg(1), prop('units'));
const rhsSymbols = pipe(nthArg(1), prop('symbols'));

const mergeMultiplicationUnitSymbols = pipe(
  converge(concat, lhsUnitPairs, rhsUnitPairs),
  groupBy(head),
  mapObj(sumLastElementsInPairs),
  pickBy(notNil),
);

const performMultiplyMath = (direction, lhs, rhs) => ({
  ...entity,
  value: lhs.value * (rhs.value ** direction),
  units: converge(mergeMultiplicationUnitSymbols, lhsUnits, rhsUnits),
  symbols: converge(mergeMultiplicationUnitSymbols, lhsSymbols, rhsSymbols),
}); // FIXME 'All unitless properties shouldn't carry after multiplication'

const abstractMathMultply = cond([
  [eitherValueNil, toNil],
  [eitherIsZero, toZeroEntity],
  [T, ifElse(needConversion,
    converge(performMultiplyMath, sign, aToSi, bToSi),
    converge(performMultiplyMath, sign, a, b),
  )],
]);


const performExponentMath = (direction, lhs, rhs) => ({
  ...entity,
  value: lhs.value ** (rhs.value * direction),
  units: mapObj(multiply(rhs.value), lhs.units),
  symbols: mapObj(multiply(rhs.value), lhs.symbols),
});

const abstractMathExponent = cond([
  [eitherValueNil, toNil],
  [bNotPureNumericEntity, toNil],
  [T, converge(performExponentMath, sign, a, b)],
]);

const valueAdd = partial(abstractMathAdd, 1);
const valueSubtract = partial(abstractMathAdd, -1);
const valueMultiply = partial(abstractMathMultply, 1);
const valueDivide = partial(abstractMathMultply, -1);
const valueExporent = partial(abstractMathExponent, 1);

export {
  valueAdd as add,
  valueSubtract as subtract,
  valueMultiply as multiply,
  valueDivide as divide,
  valueExporent as exporent,
};
