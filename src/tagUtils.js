import { TAG_PARSE_OPTIONS, TAG_CLOSE_BRACKET, TAG_COMMA, TAG_NOOP, TAG_NUMBER, TAG_OPEN_BRACKET, TAG_OPERATOR, TAG_SYMBOL, TAG_UNIT, TAG_UNIT_POWER_PREFIX, TAG_UNIT_POWER_SUFFIX } from './tagTypes';

export const isSymbol = whereEq({ type: TAG_SYMBOL.type })
export const isNoop = whereEq({ type: TAG_NOOP.type });

export const untailTags = reduce((out, tag) => {
  const { tail, ...tagWithoutTail } = tag;

  if (tail) {
    if (isNoop(tag)) {
      return out.concat(tagWithoutTail, tail);
    }

    return out.concat(tail);
  }

  return out.concat(tagWithoutTail);
}, []);

export const trimNoop = pipe(
  dropWhile(isNoop),
  dropLastWhile(isNoop),
);
