import {
  pipe, equals, nth, always, takeLast, zip, all, dropLast, reduced, evolve, assoc, reduce, __,
  length,
} from 'ramda';
import { text, textNumber } from '../../../parse/tags/util';
import { notNaN } from '../../../util';

const to = pipe(text, equals('to'));
const base = pipe(text, equals('base'));
const binary = pipe(text, equals('binary'));
const octal = pipe(text, equals('octal'));
const hexadecimal = pipe(text, equals('hexadecimal'));
const isNumber = pipe(textNumber, notNaN);

const formattingBaseFormats = [
  { pattern: [to, base, isNumber], resolve: pipe(nth(2), text, Number) },
  { pattern: [to, binary], resolve: always(2) },
  { pattern: [to, octal], resolve: always(8) },
  { pattern: [to, hexadecimal], resolve: always(16) },
];

function parseFormattingBaseFn(context, format) {
  if (context.hints && context.hints.base) {
    return context;
  }

  const formatPatternLength = length(format.pattern);
  const lastTags = takeLast(formatPatternLength, context.tags);
  const patternMatchers = zip(
    format.pattern,
    lastTags
  );
  const matches = all(([fn, tag]) => fn(tag), patternMatchers);

  if (matches) {
    const leadingTags = dropLast(formatPatternLength, context.tags);
    const hintBase = format.resolve(lastTags);

    return reduced(evolve({
      hints: assoc('base', hintBase),
      tags: always(leadingTags),
    }, context));
  }
  return context;
}

const parseFormattingBase = reduce(parseFormattingBaseFn, __, formattingBaseFormats);

const getFormattingHints = pipe(
  assoc('hints', {}),
  parseFormattingBase
);
export default getFormattingHints;
