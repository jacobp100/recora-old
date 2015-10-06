import { toString as entityToString } from './entity';


export const toString = (context, compositeEntity) => {
  return pipe(
    map(partial(entityToString, context)),
    join(' '),
  )(compositeEntity.value);
};
