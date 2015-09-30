import { entity, compositeEntity } from './descriptors';
import { toString as entityToString } from './entity';
import { toString as compositeEntityToString } from './compositeEntity';

export function toString(context, value) {
  switch (value.type) {
  case entity.type:
    return entityToString(context, value);
  case compositeEntity.type:
    return compositeEntityToString(context, value);
  default:
    return `[type ${value}]`;
  }
}
