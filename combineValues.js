import { dimensions, baseDimensions } from './types/entity';
import entityMath from './math/entity';


function shouldDivideDimensions(lhsDimensions, rhsDimensions) {
  const overlap = intersection(keys(lhsDimensions), keys(rhsDimensions));
  const onlyOverlap = pick(overlap);

  return (overlap.length > 0) && equals(onlyOverlap(lhsDimensions), onlyOverlap(rhsDimensions));
}

const lhs = nthArg(1);
const rhs = nthArg(2);

const units = prop('units');
const unitsLength = pipe(units, length);
const baseDimensionsEmpty = pipe(baseDimensions, keys, isEmpty);

const eitherBaseDimensionsEmpty = either(
	pipe(lhs, baseDimensionsEmpty),
	pipe(rhs, baseDimensionsEmpty)
);
const unitsEqual = converge(equals,
	pipe(lhs, units),
	pipe(rhs, units)
);
const baseDimensionsEqual = converge(equals,
	pipe(lhs, baseDimensions),
	pipe(rhs, baseDimensions)
);
const shouldDivide = converge(shouldDivideDimensions,
	pipe(lhs, dimensions),
	pipe(rhs, dimensions)
);
const lhsUnitsLengthLessThanRhsUnitsLength = converge(lt,
	pipe(lhs, unitsLength),
	pipe(rhs, unitsLength)
);

const combineEntities = cond([
  // Unitless values multiply: `2 sin(...)` etc
  [eitherBaseDimensionsEmpty, entityMath.multiply],
  // 5cm by 40cm should be multiplied and not added (as would happen below)
  [unitsEqual, entityMath.multiply],
	// If the dimensions are equal, either convert or add (unless unitless)
	// I.e. `3 feet 5 inches` needs to be added
	[baseDimensionsEqual, entityMath.add],
	// Divide the statement with the most units by the unit with the least
	// I.e. `$5 at $3 per kilo` gives the same answer as `$3 per kilo using $5`
  [shouldDivide, ifElse(lhsUnitsLengthLessThanRhsUnitsLength,
    entityMath.divide,
    (ctx, a, b) => entityMath.divide(ctx, b, a))],
	// No idea, just mulitply
  [T, entityMath.multiply],
]);


const combineValueMap = {
  'ENTITY': {
    'ENTITY': combineEntities,
  },
};

export default function combineValues(context, a, b) {
  const fn = path([a.type, b.type], combineValueMap);
  return fn ? fn(context, a, b) : null;
}
