import { entity } from '../types';
import assert from 'assert';


function tagUnitSymbol(unitOrSymbol) {
  return function tagUnitOrSymbolFn(values, { value, power }) {
    const lastItem = last(values);

    if (lastItem.type === entity.type) {
      return adjust(evolve({
        [unitOrSymbol]: over(
          lensProp(value),
          pipe(
            defaultTo(0),
            add(power),
          ),
        ),
      }), -1, values);
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

export const TAG_NOOP = append(entity);
export const BRACKET_GROUP = flip(append);
export const DEFAULT = identity;
