import { pipe, toLower, evolve, prop, lens, assoc, over } from 'ramda';
import { getNumberFormat } from '../locale';

const regexpToArray = (exp, text) => {
  const regexp = new RegExp(exp, 'g');
  let result;
  const tags = [];
  let i = 0;

  while ((result = regexp.exec(text)) !== null) { // eslint-disable-line
    result.start = result.index;
    result.end = result.index + result[0].length;
    tags[i++] = result;
  }

  return tags;
};

function getTags(text) {
  const numberFormat = getNumberFormat(text);
  // Refer to ./preprocessTags for the capture groups
  const tags = regexpToArray(`(?:(\\()|(\\))|(log2|log10|[\\£\\$\\€\\%]|[a-z]+)(?:\\^(\\d+))?|(0x[0-9a-f]+(?:\\.[0-9a-f]+)?|0o[0-7]+(?:.[0-7]+)?|0b[01]+(?:\\.[01]+)?|${numberFormat})|(#[0-9a-f]{3}(?:[0-9a-f]{5}|[0-9a-f]{3}|[0-9a-f])?)|(\\*\\*|[=+\\-*\\/^])|(,))`, text);

  return tags;
}

const textToTags = lens(prop('text'), assoc('tags'));

const parseText = pipe(
  evolve({ text: toLower }),
  over(textToTags, getTags),
);
export default parseText;
