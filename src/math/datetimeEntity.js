import { partial } from 'ramda';
import { convert } from '../types/entity';
import { normalize, datetimeToMoment } from '../types/datetime';

const abstractAdd = (direction, context, datetime, entity) => {
  const seconds = convert(context, { second: 1 }, entity);

  if (!seconds) {
    return null;
  }

  const momentValues = datetimeToMoment(datetime)
    .add(seconds.value * direction, 's')
    .toObject();

  return normalize(context, {
    ...datetime,
    value: {
      ...datetime.value,
      ...momentValues,
    },
  });
};

const abstractAddFlip = (direction, context, entity, datetime) =>
  abstractAdd(direction, context, datetime, entity);

export const add = partial(abstractAdd, [1]);
export const subtract = partial(abstractAdd, [-1]);
export const addFlip = partial(abstractAddFlip, [1]);
export const subtractFlip = partial(abstractAddFlip, [-1]);
