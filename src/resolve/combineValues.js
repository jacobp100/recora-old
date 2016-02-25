import {
  intersection, keys, pick, nthArg, prop, equals, pipe, isEmpty, anyPass, converge, lt, cond,
  ifElse, T, path, length,
} from 'ramda';
import { entity, datetime, timezone } from '../types';
import { dimensions, baseDimensions } from '../types/entity';
import { convert as datetimeConvert } from '../types/datetime';
import * as entityMath from '../math/entity';
import * as datetimeMath from '../math/datetime';


function shouldDivideDimensions(lhsDimensions, rhsDimensions) {
  const overlap = intersection(keys(lhsDimensions), keys(rhsDimensions));
  const onlyOverlap = pick(overlap);

  return (overlap.length > 0) && equals(onlyOverlap(lhsDimensions), onlyOverlap(rhsDimensions));
}

const context = nthArg(0);
const lhs = nthArg(1);
const rhs = nthArg(2);
const flipArgs = (fn) => (ctx, a, b) => fn(ctx, b, a);

const units = prop('units');
const unitsLength = pipe(units, length);
const baseDimensionsEmpty = pipe(baseDimensions, keys, isEmpty);

const eitherBaseDimensionsEmpty = anyPass([
  converge(baseDimensionsEmpty, [context, lhs]),
  converge(baseDimensionsEmpty, [context, rhs]),
]);
const baseDimensionsEqual = converge(equals, [
  converge(baseDimensions, [context, lhs]),
  converge(baseDimensions, [context, rhs]),
]);
const shouldDivide = converge(shouldDivideDimensions, [
  converge(dimensions, [context, lhs]),
  converge(dimensions, [context, rhs]),
]);
const lhsUnitsLengthLessThanRhsUnitsLength = converge(lt, [
  pipe(lhs, unitsLength),
  pipe(rhs, unitsLength),
]);

const combineEntities = cond([
  // Unitless values multiply: `2 sin(...)` etc
  [eitherBaseDimensionsEmpty, entityMath.multiply],
  // If the dimensions are equal, either convert or add (unless unitless)
  // I.e. `3 feet 5 inches` needs to be added
  [baseDimensionsEqual, entityMath.add],
  // Divide the statement with the most units by the unit with the least
  // I.e. `$5 at $3 per kilo` gives the same answer as `$3 per kilo using $5`
  [shouldDivide, ifElse(lhsUnitsLengthLessThanRhsUnitsLength,
    flipArgs(entityMath.divide),
    entityMath.divide
  )],
  // No idea, just mulitply
  [T, entityMath.multiply],
]);


const combineValueMap = {
  [entity.type]: {
    [entity.type]: combineEntities,
  },
  [datetime.type]: {
    [datetime.type]: datetimeMath.add,
    [timezone.type]: flipArgs(datetimeConvert),
  },
};

export default function combineValues(ctx, a, b) {
  const fn = path([a.type, b.type], combineValueMap);
  return fn ? fn(ctx, a, b) : null;
}
