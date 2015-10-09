import { TAG_COMMA, TAG_OPEN_BRACKET, TAG_CLOSE_BRACKET } from '../tags';

export const TEXT_SYMBOL_UNIT = 'TEXT_SYMBOL_UNIT';
export const TEXT_SYMBOL_UNIT_EXPONENT = 'TEXT_SYMBOL_UNIT_EXPONENT';
export const TEXT_NUMBER = 'TEXT_NUMBER';
export const TEXT_COLOR = 'TEXT_COLOR';
export const TEXT_OPERATOR = 'TEXT_OPERATOR';

export const statementParts = [
  null, // full text
  TAG_OPEN_BRACKET,
  TAG_CLOSE_BRACKET,
  TEXT_SYMBOL_UNIT, // FIXME: Add TAG_PERCENTAGE
  TEXT_SYMBOL_UNIT_EXPONENT,
  TEXT_NUMBER,
  TEXT_COLOR,
  TEXT_OPERATOR,
  TAG_COMMA,
];
export const partStatement = pipe(
  invert,
  mapObj(head),
)(statementParts);
