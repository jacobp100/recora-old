import unitsDerived from '../data/unitsDerived';
import { getUnitValue, getSiUnit } from '../locale';
import { mapWithAccum } from '../util';

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

export const resolveDimensionlessUnits = (context, entity) => pipe(
  prop('units'),
  pickBy((power, unit) => !getUnitType(context, unit)),
  toPairs,
  reduce((out, [unit, power]) => {
    const unitValue = getUnitValue(context, unit).base ** power;

    return evolve({
      value: multiply(unitValue),
      units: omit([unit]),
    }, out);
  }, entity),
)(entity);


export const dimensions = (context, entity) => pipe(
  prop('units'),
  toPairs,
  groupBy(([unit]) => {
    const unitValue = getUnitValue(context, unit);
    return unitValue ? String(unitValue.type) : unit;
  }),
  omit(['undefined']),
  mapObj(sumLastElementsInPairs),
  pickBy(notNil),
)(entity);

const derivedUnitsForType = ifElse(has(__, unitsDerived),
  pipe(prop(__, unitsDerived), toPairs),
  (type) => ([[type, 1]])
);

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

function getSiUnits(context, entity) {
  return pipe(
    dimensions,
    toPairs,
    map(adjust(partial(getSiUnit, context), 0)),
    fromPairs,
  )(context, entity);
}

function convertValueReducerFn(context, direction, value, [name, power]) {
  const unit = getUnitValue(context, name);

  if (unit) {
    return value * (unit.base) ** (-direction * power);
  }
  return value;
}
function convertValue(context, direction, units, value) {
  const nonLinearUnits = pipe(
    values,
    filter((name) => {
      const unit = getUnitValue(context, name);
      return unit && unit.forwardFn;
    }),
  )(units);
  const nonLinearUnitsSize = length(nonLinearUnits);

  if (nonLinearUnitsSize !== 0) {
    const toUnitsSize = pipe(keys, length)(units);
    const nonLinearUnit = head(nonLinearUnits);

    if (nonLinearUnitsSize > 1 || toUnitsSize > nonLinearUnitsSize || nonLinearUnit !== 1) {
      return null;
    }

    const fn = {
      '1': 'forwardFn',
      '-1': 'backwardFn',
    }[direction];

    const unit = context.getUnitValue(context, nonLinearUnit);
    return unit[fn](value);
  }

  return reduce(
    partial(convertValueReducerFn, context, direction),
    value,
    toPairs(units),
  );
}

export const convert = (context, units, entity) => {
  const entityBaseDimensions = baseDimensions(context, entity);
  const unitBaseDimensions = baseDimensions(context, { ...base, units });

  if (!equals(entityBaseDimensions, unitBaseDimensions)) {
    return null;
  }

  const value = pipe(
    partial(convertValue, context, -1, entity.units),
    partial(convertValue, context, 1, units),
  )(entity.value);
  return { ...entity, value, units };
};

const floorEntityAccum = (context, entity, units) => {
  const exactEntity = convert(context, units, entity);
  const compositeEntity = { ...exactEntity, value: Math.floor(exactEntity.value) };
  const remainder = { ...exactEntity, value: exactEntity.value - compositeEntity.value };

  return [remainder, compositeEntity];
};

export const convertComposite = (context, unitArray, entity) => {
  const value = mapWithAccum(
    partial(floorEntityAccum, context),
    entity,
    unitArray
  );
  return {
    type: 'COMPOSITE_ENTITY',
    entity,
    value,
  };
};

export function toSi(context, entity) {
  const resolvedEntity = resolveDimensionlessUnits(context, entity);
  return convert(context, getSiUnits(context, resolvedEntity), resolvedEntity);
}
