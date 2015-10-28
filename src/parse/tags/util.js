import { TAG_NOOP, TAG_SYMBOL } from './index';
import { notNil } from '../../util';

export const isSymbol = whereEq({ type: TAG_SYMBOL });
export const isNoop = whereEq({ type: TAG_NOOP });

export const trimNoop = pipe(
  dropWhile(isNoop),
  dropLastWhile(isNoop),
);

export const text = ifElse(notNil, nth(0), always(undefined)); // Number(undefined) === NaN, Number(null) === 0
export const textNumber = pipe(text, Number);
