import { entity, compositeEntity, color, datetime, valueAssignment } from './index';
import {
  toString as entityToString, convert as entityConvert, convertComposite as entityConvertComposite,
} from './entity';
import { toString as compositeEntityToString } from './compositeEntity';
import { toString as colorToString, convert as colorConvert } from './color';
import { toString as datetimeEntityToString } from './datetime';
import { toString as valueAssignmentToString } from './valueAssignment';


export function convert(context, units, value) {
  switch (value.type) {
    case entity.type:
      return entityConvert(context, units, value);
    case color.type:
      return colorConvert(context, units, value);
    default:
      return null;
  }
}

export function convertComposite(context, units, value) {
  switch (value.type) {
    case entity.type:
      return entityConvertComposite(context, units, value);
    default:
      return null;
  }
}

export function toString(context, value) {
  switch (value.type) {
    case entity.type:
      return entityToString(context, value);
    case compositeEntity.type:
      return compositeEntityToString(context, value);
    case color.type:
      return colorToString(context, value);
    case datetime.type:
      return datetimeEntityToString(context, value);
    case valueAssignment.type:
      return valueAssignmentToString(context, value);
    default:
      return `[type ${value.type}]`;
  }
}
