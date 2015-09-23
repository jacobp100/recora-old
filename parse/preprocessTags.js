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
  '+': 'ADD',
  '-': 'SUBTRACT',
  '*': 'MULTIPLY',
  '/': 'DIVIDE',
  '**': 'EXPONENT',
  '^': 'EXPONENT',
  '=': 'EQUATE',
};

const processTagElement = {
  TEXT_SYMBOL_UNIT(context, tag) {
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

    const unit = locale.getUnit(context, value);

    if (unit !== null) {
      options.push({
        ...tag,
        type: 'TAG_UNIT',
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
        type: 'TAG_SYMBOL',
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
        type: 'TAG_STATEMENT',
        value: constant.exponent(power),
      });
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
  //     type: 'TAG_COLOR',
  //     value: colorForce.hex(value);
  //   }
  // }
  TEXT_OPERATOR(context, tag) {
    return {
      ...tag,
      type: 'TAG_OPERATOR',
      value: operators[tag.value],
    };
  },
  TEXT_NUMBER(context, tag) {
    return {
      ...tag,
      type: 'TAG_NUMBER',
      value: locale.parseNumber(context, tag.value),
    };
  },
  default(context, tag) {
    return tag;
  },
};

const findValueAndType = pipe(
  zip(statementParts),
  filter(([type, tag]) => (type !== null && tag !== undefined)),
  head,
);

const processTag = curry((context, tag) => {
  if (tag.type) {
    return tag;
  }

  const [type, value] = findValueAndType(tag);
  const { start, end } = tag;

  const newTag = { start, end, value, type };

  return (processTagElement[type] || processTagElement.default)(context, newTag);
});

function resolveTagBracket(bracketLevel, tag) {
  if (tag.type === 'TAG_OPEN_BRACKET') {
    return [bracketLevel + 1, { ...tag, value: bracketLevel }];
  } else if (tag.type === 'TAG_CLOSE_BRACKET') {
    return [bracketLevel - 1, { ...tag, value: bracketLevel - 1 }];
  }
  return [bracketLevel, tag];
}

const preprocessTags = pipe(
  locale.preprocessTags,
  over(
    lensProp('tags'),
    reject(isNil),
  ),
  over(
    lens(identity, assoc('tags')),
    (context) => (
      map(processTag(context), context.tags)
    ),
  ),
  over(
    lensProp('tags'),
    pipe( // FIXME: mapWithAccum
      mapAccum(resolveTagBracket, 0),
      last,
    )
  ),
  tap(arg=>(console.log(arg),arg))
);
export default preprocessTags;
