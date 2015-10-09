import { entity, compositeEntity, color } from './index';
import { toString as entityToString } from './entity';
import { toString as compositeEntityToString } from './compositeEntity';
import { toString as colorEntityToString } from './color';

export function toString(context, value) {
  switch (value.type) {
  case entity.type:
    return entityToString(context, value);
  case compositeEntity.type:
    return compositeEntityToString(context, value);
  case color.type:
    return colorEntityToString(context, value);
  default:
    return `[type ${value.type}]`;
  }
}
