import { TAG_PARSE_OPTIONS, TAG_NOOP, TAG_UNIT, TAG_SYMBOL, TAG_OPERATOR, TAG_NUMBER } from '../tagTypes';
import { ADD, SUBTRACT, MULTIPLY, DIVIDE, EXPONENT, EQUATE } from '../operatorTypes';
import { getUnitName, parseNumber } from '../locale';
import { entity } from '../types';

const charToOperator = {
  '+': ADD,
  '-': SUBTRACT,
  '*': MULTIPLY,
  '/': DIVIDE,
  '**': EXPONENT,
  '^': EXPONENT,
  '=': EQUATE,
};

export function TEXT_SYMBOL_UNIT(context, tag, captureGroup) {
  const { value, start, end } = tag;
  let canNoop = false;
  const options = [];

  const power = Number(captureGroup[4] || 1);

  // if (functions.hasOwnProperty(value)) {
  //   options.push({
  //     ...out,
  //     type: 'TAG_FUNCTION',
  //     value,
  //     power,
  //   });
  // }

  // if (power === 1) {
  //   const colour = colorForge.css(value);
  //
  //   if (colour !== null) {
  //     options.push({
  //       ...out,
  //       type: 'TAG_COLOR',
  //       value: colour,
  //     });
  //   }
  // }

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
    // Maybe it's in the flow that you define a constant, x = 3, then when you try to redefine it, it might fail?
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

  const constant = context.constants[value];
  if (constant) {
    options.push({
      ...tag,
      type: entity.type,
      value: constant.exponent(power),
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
    type: TAG_NOOP,
    start,
    end,
  };
}

// export function TEXT_COLOR(tag) {
//   return {
//     ...tag,
//     type: 'TAG_COLOR',
//     value: colorForce.hex(value);
//   }
// }

export function TEXT_OPERATOR(context, tag) {
  return {
    ...tag,
    type: TAG_OPERATOR,
    value: charToOperator[tag.value],
  };
}

export function TEXT_NUMBER(context, tag) {
  return {
    ...tag,
    type: TAG_NUMBER,
    value: parseNumber(context, tag.value),
  };
}

export function DEFAULT(context, tag) {
  return tag;
}
