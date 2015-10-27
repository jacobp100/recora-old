import { entity } from '../types';
import { convert } from '../types/entity';
import { toUtc, timestamp } from '../types/datetime';


function dateDifference(context, lhs, rhs) {
  const utcTimestamp = pipe(partial(toUtc, [context]), partial(timestamp, [context]));

  const seconds = Math.abs(utcTimestamp(lhs) - utcTimestamp(rhs)) / 1000;
  const dateEntity = { ...entity, value: seconds, units: { second: 1 } };

  if (seconds > 86400) {
    return convert(context, { day: 1 }, dateEntity);
  } else if (seconds > 3600) {
    return convert(context, { hour: 1 }, dateEntity);
  } else if (seconds > 60) {
    return convert(context, { minute: 1 }, dateEntity);
  }
  return dateEntity;
}

export {
  dateDifference as add,
  dateDifference as subtract,
};
