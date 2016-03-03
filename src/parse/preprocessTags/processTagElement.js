import { map, of } from 'ramda';
import Color from 'color-forge';
import {
  TAG_PARSE_OPTIONS, TAG_NOOP, TAG_UNIT, TAG_OPERATOR, TAG_NUMBER, TAG_FUNCTION, TAG_SYMBOL,
  TAG_COLOR, TAG_CONSTANT,
} from '../tags';
import { getUnitName, parseNumber, getConstant } from '../../environment';
import { ADD, SUBTRACT, MULTIPLY, DIVIDE, EXPONENT, EQUATE, FACTORIAL } from '../../math/operators';
import { exponent } from '../../math/entity';
import { entity, color } from '../../types';
import functions from '../../baseContext/functions';

const charToOperator = {
  '+': ADD,
  '-': SUBTRACT,
  '*': MULTIPLY,
  '/': DIVIDE,
  '**': EXPONENT,
  '^': EXPONENT,
  '=': EQUATE,
  '!': FACTORIAL,
};

const preprocessTagElement = {
  TEXT_SYMBOL_UNIT(context, tag, captureGroup) {
    const { value, start, end } = tag;
    let canNoop = false;
    const options = [];

    const power = Number(captureGroup[4] || 1);

    if (functions[value]) {
      options.push({
        ...tag,
        type: TAG_FUNCTION,
        value,
        power,
      });
    }

    if (power === 1) {
      const colorValue = Color.css(value);

      if (colorValue !== null) {
        options.push({
          ...tag,
          type: TAG_COLOR,
          value: {
            ...color,
            value: colorValue,
          },
        });
      }
    }

    const unit = getUnitName(context, value);

    if (unit !== null) {
      options.push({
        ...tag,
        type: TAG_UNIT,
        value: unit,
        power,
      });
    }

    if (options.length === 0) {
      // Why is this above getting constants?
      // If we move this below, it makes the code easier
      // Maybe it's in the flow that you define a constant, x = 3,
      // then when you try to redefine it, it might fail?
      // But shouldn't the = operator return null if that was the case?
      options.push({
        ...tag,
        type: TAG_SYMBOL,
        value,
        power,
      });
      // TODO: If more than one symbol can be solved, make xy and xy^2 work
      canNoop = true;
    }

    const constant = getConstant(context, value);
    if (constant) {
      options.push({
        ...tag,
        type: TAG_CONSTANT,
        value: exponent(context, constant, { ...entity, value: power }),
      });
    }

    if (canNoop) {
      options.push({
        ...tag,
        type: TAG_NOOP,
      });
    }

    if (options.length > 1) {
      return {
        type: TAG_PARSE_OPTIONS,
        value: map(of, options), // wrap all option values to arrays
      };
    } else if (options.length === 1) {
      return options[0];
    }

    return {
      ...tag,
      type: TAG_NOOP,
      start,
      end,
    };
  },
  TEXT_COLOR(context, tag) {
    return {
      ...tag,
      type: TAG_COLOR,
      value: {
        ...color,
        value: Color.hex(tag.value),
      },
    };
  },
  TEXT_OPERATOR(context, tag) {
    return {
      ...tag,
      type: TAG_OPERATOR,
      value: charToOperator[tag.value],
    };
  },
  TEXT_NUMBER(context, tag) {
    return {
      ...tag,
      type: TAG_NUMBER,
      value: parseNumber(context, tag.value),
    };
  },
  default(context, tag) {
    return tag;
  },
};
export default preprocessTagElement;
