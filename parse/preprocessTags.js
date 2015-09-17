import { compose, reject, isNull, zip, filter, first, map, prop, pipe } from 'ramda';
import { mergeProp } from '../util';
import * as locale from '../locale';

const statementParts = [
  null, // full text
  'TAG_OPEN_BRACKET',
  'TAG_CLOSE_BRACKET',
  'TEXT_SYMBOL_UNIT',
  null, // symbol-unit exponent
  'TEXT_NUMBER',
  'TEXT_COLOR',
  'TEXT_OPERATOR',
  'TAG_COMMA',
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

const findValueAndType = compose(
  first,
  filter(([tag, type]) => (type !== null && tag !== undefined)),
  zip(statementParts)
);

const processTagElement = {
  TEXT_SYMBOL_UNIT(tag) {
    const { value, start, end } = tag;
    let canNoop = false;
    const options = [];

    const power = Number(tag[4] || 1);

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

    const unit = this.getUnit(value);

    if (unit !== null) {
      options.push({
        ...tag,
        type: 'TAG_UNIT',
        value: unit,
        power,
      });
    }

    if (options.length === 0) {
      options.push({
        ...tag,
        type: 'TAG_SYMBOL',
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
          ...tag,
          type: 'TAG_STATEMENT',
          value: constant.exponent(power),
        });
      } else {
        options.push({
          ...tag,
          type: 'TAG_CONSTANT',
          value: Math.pow(this.constants[value], power),
        });
      }
    }

    if (canNoop) {
      options.push({
        ...tag,
        type: 'NOOP',
      });
    }

    if (options.length > 1) {
      return {
        type: 'PARSE_OPTIONS',
        value: options,
      };
    } else if (options.length === 1) {
      return options[0];
    }

    return {
      type: 'NOOP',
      start,
      end,
    };
  },
  // TEXT_COLOR(tag) {
  //   return {
  //     ...tag,
  //     value: colorForce.hex(value);
  //   }
  // }
  TEXT_OPERATOR(tag) {
    return {
      ...tag,
      type: 'TAG_OPERATOR',
      value: operators[tag.value],
    };
  },
  TEXT_NUMBER(tag) {
    return {
      ...tag,
      type: 'TAG_NUMBER',
      value: Number(tag.value),
    };
  },
  default(tag) {
    return tag;
  },
};

function processTag(tag) {
  if (tag.type) {
    return tag;
  }

  const [value, type] = findValueAndType(tag);

  const { start, end } = tag;
  const newTag = { start, end, value };

  const fn = processTagElement[type] || processTagElement.default;
  return fn(newTag);
}

const processTags = pipe(
  prop('tags'),
  processTags
);

const preprocessTags = compose(
  locale.preprocessTags,
  reject(isNull),
  mergeProp('tags', processTags),
  map(processTag)
);
export default preprocessTags;
