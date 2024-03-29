import { over, lens, identity, assoc } from 'ramda';
import { getNumberFormat } from '../environment';

function regexpToArray(exp, text) {
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
}

function regexpToText({ locale, text }) {
  const numberFormat = getNumberFormat(locale);
  const lowerText = text.toLowerCase();
  // Refer to ./text for the capture groups
  const rawTags = regexpToArray(`(?:(\\()|(\\))|(log2|log10|clz32|log1p|\\£|\\$|\\€|[a-z]+)(?:\\^(\\d+))?|(\\%)|(0x[0-9a-f]+(?:\\.[0-9a-f]+)?|0o[0-7]+(?:.[0-7]+)?|0b[01]+(?:\\.[01]+)?|${numberFormat})|(#[0-9a-f]{3}(?:[0-9a-f]{5}|[0-9a-f]{3}|[0-9a-f])?)|(\\*\\*|[=+\\-*\\/^\\!])|(,)|(\:))`, lowerText); // eslint-disable-line

  return rawTags;
}

const parseText = over(
  lens(identity, assoc('tags')),
  regexpToText
);
export default parseText;
