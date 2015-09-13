import { flow, reject, isNull, forEach, zip, filter, first, map } from 'lodash-fp';
import { bindOwn } from '../util';

const statementParts = [
  null, // full text
  'tag-open-bracket',
  'tag-close-bracket',
  'text-symbol-unit',
  null, // symbol-unit exponent
  'text-number',
  'text-colour',
  'text-operator',
  'tag-comma',
];

const operators = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '**': 'exponent',
  '^': 'exponent',
  '=': 'equate',
};

const findValueAndType = flow(
  zip(statementParts),
  filter(([tag, type]) => (type !== null && tag !== undefined)),
  first
);

function processTag(tag) {
  if (tag.type) {
    return tag;
  }

  const [value, type] = findValueAndType(tag);

  const { start, end } = tag;

  const out = { type, value, start, end };

  switch (type) {
  case 'text-symbol-unit':
    let canNoop = false;
    const options = [];

    const power = Number(tag[4] || 1);

    // if (functions.hasOwnProperty(value)) {
    //   options.push({
    //     ...out,
    //     type: 'tag-function',
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
    //       type: 'tag-colour',
    //       value: colour,
    //     });
    //   }
    // }

    const unit = this.getUnit(value);

    if (unit !== null) {
      options.push({
        ...out,
        type: 'tag-unit',
        value: unit,
        power,
      });
    }

    if (options.length === 0) {
      options.push({
        ...out,
        type: 'tag-symbol',
        value,
        power,
      });
      // TODO: If more than one symbol can be solved, make xy and xy^2 work
      canNoop = true;
    }

    const constant = this.constants[value];
    if (constant) {
      if (constant.type === 'statement') {
        options.push({
          ...out,
          type: 'tag-statement',
          value: constant.exponent(power),
        });
      } else {
        options.push({
          ...out,
          type: 'tag-constant',
          value: Math.pow(this.constants[value], power),
        });
      }
    }

    if (canNoop) {
      options.push({
        ...out,
        type: 'noop',
      });
    }

    if (options.length > 1) {
      return {
        type: 'parse-options',
        value: options,
      };
    } else if (options.length === 1) {
      return options[0];
    }

    return {
      type: 'noop',
      start,
      end,
    };
  // case 'text-colour':
  //   out.type = 'tag-colour';
  //   out.value = colorForge.hex(value);
  //   break;
  case 'text-operator':
    return {
      ...out,
      type: 'tag-operator',
      value: operators[value],
    };
  case 'text-number':
    return {
      ...out,
      type: 'tag-number',
      value: Number(out.value),
    };
  default:
    // Not null, could be currency (unit), number...
    return out;
  }
}

const parseTags = flow(
  bindOwn(map, processTag),
  reject(isNull)
);
export default parseTags;
