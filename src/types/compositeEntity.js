import { pipe, map, partial, join } from 'ramda';
import { toString as entityToString } from './entity';


export function toString(context, compositeEntity) {
  return pipe(
    map(partial(entityToString, [context])),
    join(' ')
  )(compositeEntity.value);
}
