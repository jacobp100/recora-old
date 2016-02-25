import { whereEq, pipe, dropWhile, dropLastWhile, ifElse, nth, always } from 'ramda';
import { TAG_NOOP, TAG_SYMBOL } from './index';
import { notNil } from '../../util';

export const isSymbol = whereEq({ type: TAG_SYMBOL });
export const isNoop = whereEq({ type: TAG_NOOP });

export const trimNoop = pipe(
  dropWhile(isNoop),
  dropLastWhile(isNoop)
);

// Number(undefined) === NaN, Number(null) === 0
export const text = ifElse(notNil, nth(0), always(undefined));
export const textNumber = pipe(text, Number);
