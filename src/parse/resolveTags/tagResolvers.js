import { entity, percentage } from '../../types';
import { objectEmpty } from '../../util';
import assert from 'assert';


// FIXME: exports should just be an object
function tagUnitSymbol(unitOrSymbol) {
  return function tagUnitOrSymbolFn(values, { value, power }) {
    const lastItem = last(values);

    if (lastItem.type === entity.type) {
      const addPowerToValue = over(
        lensProp(value),
        pipe(
          defaultTo(0),
          add(power),
        ),
      );
      const evolveArg = createMapEntry(unitOrSymbol, addPowerToValue);
      const updateValuePower = evolve(evolveArg);
      return adjust(updateValuePower, -1, values);
    }

    return append(assocPath([unitOrSymbol, value], power, entity), values);
  };
}


export function TAG_NUMBER(values, { value }) {
  assert(typeof value === 'number');
  const lastItem = last(values);

  if (lastItem.type === entity.type && lastItem.value === null) {
    return adjust(assoc('value', value), -1, values);
  }

  return append({ ...entity, value }, values);
}

const defaultResolveUnit = tagUnitSymbol('units');
export function TAG_UNIT(values, unit) {
  const lastItem = last(values);

  if (unit.value !== 'percent') {
    return defaultResolveUnit(values, unit);
  }

  let newValue = null;

  if (lastItem.type === entity.type && objectEmpty(lastItem.units) && objectEmpty(lastItem.symbols)) {
    const { value } = lastItem;
    newValue = { ...percentage, value };
  }

  return update(-1, newValue, values);
}

export const TAG_SYMBOL = tagUnitSymbol('symbols');
export const TAG_NOOP = append(entity);

const appendValue = flip(append);
export const ENTITY = appendValue;
export const BRACKET_GROUP = appendValue;
export const FUNC_APPLICATION = appendValue;

export const DEFAULT = identity;
