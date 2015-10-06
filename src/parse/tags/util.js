import { TAG_NOOP, TAG_SYMBOL } from './index';

export const isSymbol = whereEq({ type: TAG_SYMBOL });
export const isNoop = whereEq({ type: TAG_NOOP });

export const trimNoop = pipe(
  dropWhile(isNoop),
  dropLastWhile(isNoop),
);
