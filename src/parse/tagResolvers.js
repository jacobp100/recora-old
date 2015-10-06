import { entity } from '../types';
import assert from 'assert';

export function TAG_NUMBER(values, { value }) {
  assert(typeof value === 'number');
  const lastItem = last(values);

  if (lastItem.type === entity.type && lastItem.value === null) {
    return adjust(assoc('value', value), -1, values);
  }

  return append({ ...entity, value }, values);
}

export function TAG_UNIT(values, { value, power }) {
  // This code is almost identical for symbols (s/unit/symbol/g)
  const lastItem = last(values);

  if (lastItem.type === entity.type) {
    return adjust(evolve({
      units: over(
        lensProp(value),
        pipe(
          defaultTo(0),
          add(power),
        ),
      ),
    }), -1, values);
  }

  return append(assocPath(['units', value], power, entity), values);
}

export function TAG_SYMBOL(values, { value, power }) {
  // This code is almost identical for symbols (s/unit/symbol/g)
  const lastItem = last(values);

  if (lastItem.type === entity.type) {
    return adjust(evolve({
      symbols: over(
        lensProp(value),
        pipe(
          defaultTo(0),
          add(power),
        ),
      ),
    }), -1, values);
  }

  return append(assocPath(['symbols', value], power, entity), values);
}

export const TAG_NOOP = append(entity);
export const BRACKET_GROUP = flip(append);
export const DEFAULT = identity;
