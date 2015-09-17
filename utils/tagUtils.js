import { reduce, compose, dropLastWhile, dropWhile } from 'ramda';

export const untailTags = reduce((out, tag) => {
  const { tail, ...tagWithoutTail } = tag;

  if (tail) {
    if (tag.type !== 'noop') {
      return out.concat(tagWithoutTail, tail);
    }

    return out.concat(tail);
  }

  return out.concat(tagWithoutTail);
}, []);

export const trimNoop = compose(
  dropWhile({ type: 'noop' }),
  dropLastWhile({ type: 'noop' })
);
