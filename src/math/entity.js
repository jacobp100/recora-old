import { entity } from '../types';
import { baseDimensions, toSi, resolveDimensionlessUnits } from '../types/entity';


const notEmpty = complement(isEmpty);
const notZero = complement(equals(0));
const sumLastElementsInPairs = pipe(map(last), sum);

const toNil = always(null);
const toZeroEntity = always({ ...entity, value: 0 });

const valueZero = propEq('value', 0);
const valueNil = propSatisfies(isNil, 'value');

const sign = nthArg(0);
const context = nthArg(1);

// FIXME: All shitty. Just pipe(lhs, valueZero) etc. See combineValues
const lhs = nthArg(2);
const lhsValueZero = pipe(lhs, valueZero);
const lhsValueNil = pipe(lhs, valueNil);
const lhsUnits = pipe(lhs, prop('units'));
const lhsUnitKeys = pipe(lhsUnits, keys);
const lhsUnitKeysLength = pipe(lhsUnitKeys, length);
const lhsSymbols = pipe(lhs, prop('symbols'));
const lhsBaseDimensions = converge(baseDimensions, context, lhs);
const lhsToSi = converge(toSi, context, lhs);

const rhs = nthArg(3);
const rhsValueZero = pipe(rhs, valueZero);
const rhsValueNil = pipe(rhs, valueNil);
const rhsUnits = pipe(rhs, prop('units'));
const rhsUnitKeys = pipe(rhsUnits, keys);
const rhsUnitKeysLength = pipe(rhsUnitKeys, length);
const rhsSymbols = pipe(rhs, prop('symbols'));
const rhsBaseDimensions = converge(baseDimensions, context, rhs);
const rhsToSi = converge(toSi, context, rhs);
const rhsHasUnits = pipe(rhsUnitKeys, notEmpty);
const rhsHasSymbols = pipe(rhsSymbols, keys, notEmpty);
const rhsNotPureNumericEntity = anyPass([rhsHasUnits, rhsHasSymbols]);

const eitherValueNil = anyPass([lhsValueNil, rhsValueNil]);

const symbolsMatch = converge(equals, lhsSymbols, rhsSymbols);
const symbolsDiffer = complement(symbolsMatch);
const unitsMatch = converge(equals, lhsUnits, rhsUnits);
const baseDimensionsMatch = converge(equals, lhsBaseDimensions, rhsBaseDimensions);


const flipRhsBySign = (direction, ctx, left, right) => ({ ...right, value: right.value * direction });
const performAddMath = (direction, ctx, left, right) => ({ ...left, value: left.value + right.value * direction });
// (sign: (1, -1), context: Context, lhs: Entity, rhs: Entity) => Entity
const abstractMathAdd = cond([
  [eitherValueNil, toNil],
  [rhsValueZero, lhs],
  [lhsValueZero, flipRhsBySign],
  [symbolsDiffer, toNil],
  [unitsMatch, performAddMath],
  [baseDimensionsMatch, converge(performAddMath, sign, context, lhsToSi, rhsToSi)],
  [T, toNil],
]);


const rhsIsZeroAndNotDivision = allPass([rhsValueZero, pipe(sign, equals(1))]);
const overlapUnitKeysLength = pipe(
  converge(intersection, rhsUnitKeys, lhsUnitKeys),
  length
);
const lhsRhsKeysSetsContainNoSubOrSuperset = anyPass([
  converge(equals, overlapUnitKeysLength, lhsUnitKeysLength),
  converge(equals, overlapUnitKeysLength, rhsUnitKeysLength),
]);
const needConversion = complement(lhsRhsKeysSetsContainNoSubOrSuperset);

const mergeMultiplicationLhsUnitPairs = pipe(nthArg(0), toPairs);
const mergeMultiplicationRhsUnitPairs = pipe(nthArg(1), toPairs);

const mergeMultiplicationUnitSymbols = pipe(
  converge(concat, mergeMultiplicationLhsUnitPairs, mergeMultiplicationRhsUnitPairs),
  groupBy(head),
  mapObj(sumLastElementsInPairs),
  pickBy(notZero),
);

const performMultiplyMath = (direction, ctx, left, right) => {
  const byDirection = mapObj(multiply(direction));

  const value = {
    ...entity,
    value: left.value * (right.value ** direction),
    units: mergeMultiplicationUnitSymbols(left.units, byDirection(right.units)),
    symbols: mergeMultiplicationUnitSymbols(left.symbols, byDirection(right.symbols)),
  };

  // Remove all units without a type
  return resolveDimensionlessUnits(ctx, value);
};

const abstractMathMultiply = cond([
  [eitherValueNil, toNil],
  [lhsValueZero, toZeroEntity],
  [rhsIsZeroAndNotDivision, toZeroEntity],
  [needConversion, converge(performMultiplyMath, sign, context, lhsToSi, rhsToSi)],
  [T, performMultiplyMath],
]);


const performExponentMath = (direction, ctx, left, right) => {
  const byExponent = mapObj(multiply(right.value));

  return {
    ...entity,
    value: left.value ** (right.value * direction),
    units: byExponent(left.units),
    symbols: byExponent(left.symbols),
  };
};

const abstractMathExponent = cond([
  [eitherValueNil, toNil],
  [rhsNotPureNumericEntity, toNil],
  [T, performExponentMath],
]);

const valueAdd = partial(abstractMathAdd, 1);
const valueSubtract = partial(abstractMathAdd, -1);
const valueMultiply = partial(abstractMathMultiply, 1);
const valueDivide = partial(abstractMathMultiply, -1);
const valueExponent = partial(abstractMathExponent, 1);
// No inverse exponent

export {
  valueAdd as add,
  valueSubtract as subtract,
  valueMultiply as multiply,
  valueDivide as divide,
  valueExponent as exponent,
};
