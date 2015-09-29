// import { reduce, compose, dropLastWhile, dropWhile } from 'ramda';

export const isNoop = whereEq({ type: 'NOOP' });

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
