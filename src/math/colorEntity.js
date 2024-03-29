import { partial } from 'ramda';
import { channelMultiply, exponent as colorExponent } from '../types/color';
import { isNumber } from '../types/entity';

function abstractMultiply(direction, context, color, entity) {
  if (isNumber(context, entity)) {
    return channelMultiply(context, color, Math.pow(entity.value, direction));
  }
  return null;
}

function exponent(context, color, entity) {
  if (isNumber(context, entity)) {
    return colorExponent(context, color, entity.value);
  }
  return null;
}

export const multiply = partial(abstractMultiply, [1]);
export const divide = partial(abstractMultiply, [-1]);
export { exponent };
