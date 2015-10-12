import { entity as entityDescriptor } from './index';
import unitsDerived from '../data/unitsDerived';
import { getUnitValue, getSiUnit, formatEntity } from '../environment';
import { mapWithAccum, objectEmpty, nilValue } from '../util';


const notNil = complement(isNil);
const sumLastElementsInPairs = pipe(map(last), sum);


// (context, name: string) -> string?
const getUnitType = pipe(
  getUnitValue,
  ifElse(isNil,
    nilValue,
    prop('type')
  ),
);

// (context, name: string) -> bool
const isNonLinearUnit = pipe(
  getUnitValue,
  ifElse(notNil,
    has('forwardFn'),
    always(false),
  ),
);

function getNonLinearUnitPairs(context, units) {
  return pipe(
    toPairs,
    filter(
      pipe(head, partial(isNonLinearUnit, [context])),
    ),
  )(units);
}

const isEmptyPredicate = where({
  value: notNil,
  units: objectEmpty,
  symbols: objectEmpty,
});
export function isNumber(context, entity) {
  return isEmptyPredicate(entity);
}

export function isResolvable(context, entity) {
  const { units } = entity;
  const nonLinearUnits = getNonLinearUnitPairs(context, units);
  const nonLinearUnitsSize = length(nonLinearUnits);

  if (nonLinearUnitsSize > 0) {
    const unitsSize = pipe(keys, length)(units);
    const linearUnitsSize = unitsSize - nonLinearUnitsSize;
    const nonLinearUnitPower = pipe(head, last)(nonLinearUnits);

    if (nonLinearUnitsSize > 1 || linearUnitsSize > 0 || nonLinearUnitPower !== 1) {
      return false;
    }
  }

  return true;
}

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
  pickBy(complement(equals(0))),
)(entity);

const derivedUnitsForType = ifElse(has(__, unitsDerived),
  pipe(prop(__, unitsDerived), toPairs),
  (type) => ([[type, 1]])
);

// context, entity
export const baseDimensions = pipe(
  dimensions,
  toPairs,
  chain(([type, value]) => (
    map(adjust(multiply(value), -1), derivedUnitsForType(type))
  )),
  groupBy(head),
  mapObj(sumLastElementsInPairs),
  pickBy(complement(equals(0))),
);

function getSiUnits(context, entity) {
  return pipe(
    dimensions,
    toPairs,
    map(adjust(partial(getSiUnit, [context]), 0)),
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
  const nonLinearUnits = getNonLinearUnitPairs(context, units);
  const nonLinearUnit = pipe(map(head), head)(nonLinearUnits);

  if (nonLinearUnit) {
    const fn = {
      '1': 'forwardFn',
      '-1': 'backwardFn',
    }[direction];

    const unit = getUnitValue(context, nonLinearUnit);
    return unit[fn](value);
  }

  return reduce(
    partial(convertValueReducerFn, [context, direction]),
    value,
    toPairs(units),
  );
}

export function convert(context, units, entity) {
  const entityBaseDimensions = baseDimensions(context, entity);
  const unitBaseDimensions = baseDimensions(context, { ...entityDescriptor, units });

  const dimensionsMatch = equals(entityBaseDimensions, unitBaseDimensions);
  const entityIsResolvable = isResolvable(context, entity);

  if (!dimensionsMatch || !entityIsResolvable) {
    return null;
  }

  const value = pipe(
    partial(convertValue, [context, -1, entity.units]),
    partial(convertValue, [context, 1, units]),
  )(entity.value);
  return { ...entity, value, units };
}

function floorEntityAccum(context, entity, units) {
  const exactEntity = convert(context, units, entity);
  // Add small amount to account for rounding errors
  const compositeEntity = { ...exactEntity, value: Math.floor(exactEntity.value + 1E-6) };
  const remainder = { ...exactEntity, value: exactEntity.value - compositeEntity.value };

  return [remainder, compositeEntity];
}

export function convertComposite(context, unitArray, entity) {
  const value = mapWithAccum(
    partial(floorEntityAccum, [context]),
    entity,
    unitArray
  );
  return {
    type: 'COMPOSITE_ENTITY',
    entity,
    value,
  };
}

export function toSi(context, entity) {
  const resolvedEntity = resolveDimensionlessUnits(context, entity);
  return convert(context, getSiUnits(context, resolvedEntity), resolvedEntity);
}

const isCurrency = pipe(dimensions, propEq('currency', 1));

export function toString(context, entity) {
  const formattingHints = {
    currency: isCurrency(context, entity),
  };

  return formatEntity(context, entity, formattingHints);
}
