import { toString as entityToString } from './entity';

const base = {
  type: 'COMPOSITE_ENTITY',
  entity: null,
  value: null,
};
export default base;

export const toString = (context, compositeEntity) => {
  return map(entityToString, compositeEntity.value).join(' ');
};
