import { reduce, flow, dropRightWhile, dropWhile } from 'lodash-fp';

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

export const trimNoop = flow(
  dropRightWhile({ type: 'noop' }),
  dropWhile({ type: 'noop' })
);
