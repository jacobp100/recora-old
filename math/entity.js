import entity, { baseDimensions, toSi } from '../types/entity';


const notNil = complement(isNil);
const sumLastElementsInPairs = pipe(map(last), sum);

const isZero = propEq('value', 0);
const valueNil = propEq(isNil, 'value');
const toNil = always(null);
const toZeroEntity = always({ ...entity, value: 0 });

const sign = nthArg(0);
const context = nthArg(1);

const lhs = nthArg(2);
const lhsIsZero = pipe(lhs, isZero);
const lhsValueNil = pipe(lhs, valueNil);
const lhsUnits = pipe(lhs, prop('units'));
const lhsUnitKeys = pipe(lhsUnits, keys);
const lhsUnitKeysLength = pipe(lhsUnitKeys, length);
const lhsSymbols = pipe(lhs, prop('symbols'));
const lhsBaseDimensions = converge(baseDimensions, context, lhs);
const lhsToSi = converge(toSi, context, lhs);

const rhs = nthArg(3);
const rhsIsZero = pipe(rhs, isZero);
const rhsValueNil = pipe(rhs, valueNil);
const rhsUnits = pipe(rhs, prop('units'));
const rhsUnitKeys = pipe(rhsUnits, keys);
const rhsUnitKeysLength = pipe(rhsUnitKeys, length);
const rhsSymbols = pipe(rhs, prop('symbols'));
const rhsBaseDimensions = converge(baseDimensions, context, rhs);
const rhsToSi = converge(toSi, context, rhs);
const rhsHasUnits = pipe(rhsUnitKeys, isEmpty);
const rhsHasSymbols = pipe(rhsSymbols, keys, length);
const rhsNotPureNumericEntity = complement(either(rhsHasUnits, rhsHasSymbols));

const eitherIsZero = either(lhsIsZero, rhsIsZero);
const eitherValueNil = either(lhsValueNil, rhsValueNil);

const symbolsMatch = converge(equals, lhsSymbols, rhsSymbols);
const symbolsDiffer = complement(symbolsMatch);
const unitsMatch = converge(equals, lhsUnits, rhsUnits);
const baseDimensionsMatch = converge(equals, lhsBaseDimensions, rhsBaseDimensions);


const flipRhsBySign = (direction, ctx, left, right) => ({ ...right, value: right.value * direction });
const performAddMath = (direction, ctx, left, right) => ({ ...left, value: left.value + right.value * direction });
// (sign: (1, -1), context: Context, lhs: Entity, rhs: Entity) => Entity
const abstractMathAdd = cond([
  [eitherValueNil, toNil],
  [rhsIsZero, lhs],
  [lhsIsZero, flipRhsBySign],
  [symbolsDiffer, toNil],
  [unitsMatch, performAddMath],
  [baseDimensionsMatch, converge(performAddMath, sign, context, lhsToSi, rhsToSi)],
  [T, toNil],
]);


const lhsRhsUnitsOverlapLength = pipe(
  converge(intersection, rhsUnitKeys, lhsUnitKeys),
  length
);
const allArgsEqual = pipe(
  unapply(identity), // Args to array
  uniq,
  length,
  equals(1),
);
const lhsKeysLengthEqRhsKeysLengthEqOverlapKeysLength = converge(allArgsEqual,
  lhsRhsUnitsOverlapLength, lhsUnitKeysLength, rhsUnitKeysLength);
const needConversion = complement(lhsKeysLengthEqRhsKeysLengthEqOverlapKeysLength);

const mergeMultiplicationLhsUnitPairs = pipe(nthArg(0), toPairs);
const mergeMultiplicationRhsUnitPairs = pipe(nthArg(1), toPairs);

const mergeMultiplicationUnitSymbols = pipe(
  converge(concat, mergeMultiplicationLhsUnitPairs, mergeMultiplicationRhsUnitPairs),
  groupBy(head),
  mapObj(sumLastElementsInPairs),
  pickBy(notNil),
);

const performMultiplyMath = (direction, ctx, left, right) => ({
  ...entity,
  value: left.value * (right.value ** direction),
  units: mergeMultiplicationUnitSymbols(left.units, right.units),
  symbols: mergeMultiplicationUnitSymbols(left.symbols, right.symbols),
}); // FIXME 'All unitless properties shouldn't carry after multiplication'

const abstractMathMultply = cond([
  [eitherValueNil, toNil],
  [eitherIsZero, toZeroEntity],
  [T, ifElse(needConversion,
    converge(performMultiplyMath, sign, context, lhsToSi, rhsToSi),
    performMultiplyMath,
  )],
]);


const performExponentMath = (direction, ctx, left, right) => ({
  ...entity,
  value: left.value ** (right.value * direction),
  units: mapObj(multiply(right.value), left.units),
  symbols: mapObj(multiply(right.value), left.symbols),
});

const abstractMathExponent = cond([
  [eitherValueNil, toNil],
  [rhsNotPureNumericEntity, toNil],
  [T, performExponentMath],
]);

const valueAdd = partial(abstractMathAdd, 1);
const valueSubtract = partial(abstractMathAdd, -1);
const valueMultiply = partial(abstractMathMultply, 1);
const valueDivide = partial(abstractMathMultply, -1);
const valueExponent = partial(abstractMathExponent, 1);
// No inverse exponent

export {
  valueAdd as add,
  valueSubtract as subtract,
  valueMultiply as multiply,
  valueDivide as divide,
  valueExponent as exponent,
};
