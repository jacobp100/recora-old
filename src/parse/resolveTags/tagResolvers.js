import {
  last, over, lensProp, pipe, defaultTo, add, createMapEntry, evolve, adjust, append, assocPath,
  flip, update, reduced, identity, assoc,
} from 'ramda';
import {
  entity, color, timezone, percentage, funcApplication, bracketGroup,
} from '../../types';
import {
  TAG_NUMBER, TAG_SYMBOL, TAG_UNIT, TAG_PERCENTAGE, TAG_NOOP, TAG_COLOR, TAG_CONSTANT,
  TAG_DATETIME,
} from '../tags';
import { isEntity } from '../../types/util';
import { objectEmpty } from '../../util';
import assert from 'assert';


function tagUnitSymbol(unitOrSymbol) {
  return function tagUnitOrSymbolFn(values, { value, power }) {
    const lastItem = last(values);

    if (isEntity(lastItem)) {
      const addPowerToValue = over(
        lensProp(value),
        pipe(
          defaultTo(0),
          add(power)
        )
      );
      const evolveArg = createMapEntry(unitOrSymbol, addPowerToValue);
      const updateValuePower = evolve(evolveArg);
      return adjust(updateValuePower, -1, values);
    }

    return append(assocPath([unitOrSymbol, value], power, entity), values);
  };
}

function entityToPercentage(value) {
  if (objectEmpty(value.units) && objectEmpty(value.symbols)) {
    return { ...percentage, value: value.value };
  }
  return null;
}

const appendSelf = flip(append);
const appendValue = (values, { value }) => append(value, values);


const tagResolvers = {
  [TAG_NUMBER](values, { value }) {
    assert(typeof value === 'number');
    const lastItem = last(values);

    if (isEntity(lastItem) && lastItem.value === null) {
      return adjust(assoc('value', value), -1, values);
    }

    return append({ ...entity, value }, values);
  },
  [TAG_SYMBOL]: tagUnitSymbol('symbols'),
  [TAG_UNIT]: tagUnitSymbol('units'),
  [TAG_PERCENTAGE](values) {
    const lastItem = last(values);

    if (isEntity(lastItem)) {
      const newValue = entityToPercentage(lastItem);
      return update(-1, newValue, values);
    }

    return reduced(null);
  },
  [TAG_COLOR]: appendValue,
  [TAG_CONSTANT]: appendValue,
  [TAG_DATETIME]: appendValue,
  [timezone.type]: appendSelf,
  [funcApplication.type]: appendSelf,
  [bracketGroup.type]: appendSelf,
  [TAG_NOOP]: append(entity),
  default: identity,
};
export default tagResolvers;
