import { partial } from 'ramda';
import { convert } from '../types/entity';
import { normalize } from '../types/datetime';

const abstractAdd = (direction, context, datetime, entity) => {
  const seconds = convert(context, { second: 1 }, entity);

  if (!seconds) {
    return null;
  }

  return normalize(context, {
    ...datetime,
    value: {
      ...datetime.value,
      seconds: datetime.value.seconds + direction * seconds.value,
    },
  });
};

const abstractAddFlip = (direction, context, entity, datetime) =>
  abstractAdd(direction, context, datetime, entity);

export const add = partial(abstractAdd, [1]);
export const subtract = partial(abstractAdd, [-1]);
export const addFlip = partial(abstractAddFlip, [1]);
export const subtractFlip = partial(abstractAddFlip, [-1]);
