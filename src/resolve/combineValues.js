import { entity } from '../types';
import { dimensions, baseDimensions } from '../types/entity';
import * as entityMath from '../math/entity';


function shouldDivideDimensions(lhsDimensions, rhsDimensions) {
  const overlap = intersection(keys(lhsDimensions), keys(rhsDimensions));
  const onlyOverlap = pick(overlap);

  return (overlap.length > 0) && equals(onlyOverlap(lhsDimensions), onlyOverlap(rhsDimensions));
}

const context = nthArg(0);
const lhs = nthArg(1);
const rhs = nthArg(2);

const units = prop('units');
const unitsLength = pipe(units, length);
const baseDimensionsEmpty = pipe(baseDimensions, keys, isEmpty);

const eitherBaseDimensionsEmpty = anyPass([
  converge(baseDimensionsEmpty, context, lhs),
  converge(baseDimensionsEmpty, context, rhs),
]);
const baseDimensionsEqual = converge(equals,
  converge(baseDimensions, context, lhs),
  converge(baseDimensions, context, rhs),
);
const shouldDivide = converge(shouldDivideDimensions,
  converge(dimensions, context, lhs),
  converge(dimensions, context, rhs),
);
const lhsUnitsLengthLessThanRhsUnitsLength = converge(lt,
  pipe(lhs, unitsLength),
  pipe(rhs, unitsLength),
);

const combineEntities = cond([
  // Unitless values multiply: `2 sin(...)` etc
  [eitherBaseDimensionsEmpty, entityMath.multiply],
  // If the dimensions are equal, either convert or add (unless unitless)
  // I.e. `3 feet 5 inches` needs to be added
  [baseDimensionsEqual, entityMath.add],
  // Divide the statement with the most units by the unit with the least
  // I.e. `$5 at $3 per kilo` gives the same answer as `$3 per kilo using $5`
  [shouldDivide, ifElse(lhsUnitsLengthLessThanRhsUnitsLength,
    (ctx, a, b) => entityMath.divide(ctx, b, a),
    entityMath.divide
  )],
  // No idea, just mulitply
  [T, entityMath.multiply],
]);


const combineValueMap = {
  [entity.type]: {
    [entity.type]: combineEntities,
  },
};

export default function combineValues(ctx, a, b) {
  const fn = path([a.type, b.type], combineValueMap);
  return fn ? fn(ctx, a, b) : null;
}
