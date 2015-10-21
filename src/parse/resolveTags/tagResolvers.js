import { entity, color, datetime, timezone, timezoneOffset, percentage, funcApplication, bracketGroup } from '../../types';
import { TAG_NUMBER, TAG_SYMBOL, TAG_UNIT, TAG_PERCENTAGE, TAG_NOOP } from '../tags';
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

function entityToPercentage(value) {
  if (objectEmpty(value.units) && objectEmpty(value.symbols)) {
    return { ...percentage, value: value.value };
  }
  return null;
}

const appendValue = flip(append);


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
  [TAG_NOOP]: append(entity),
  [entity.type]: appendValue,
  [color.type]: appendValue,
  [datetime.type]: appendValue,
  [timezone.type]: appendValue,
  [timezoneOffset.type]: appendValue,
  [funcApplication.type]: appendValue,
  [bracketGroup.type]: appendValue,
  default: identity,
};
export default tagResolvers;
