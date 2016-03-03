/* eslint max-len: [0] */
import {
  pipe, groupBy, toPairs, sortBy, head, map, prop, last, reverse, equals, ifElse, always, whereEq,
  curry, insert, remove, reject, slice, reduce, partial, __, anyPass, gte, over, lensProp, when,
  assoc, evolve, length,
} from 'ramda';
import {
  shortYear, plus, plusMinus, dash, slash, colon, dot, t, ms, s, mm, hh, hhmm, D, DD, M, MM, YY,
  YYYY,
} from './formats';
import { TAG_DATETIME, TAG_DATE, TAG_TIME } from '../tags';
import { text, textNumber } from '../tags/util';
import {
  getLocaleDateFormats, getLocaleTimeFormats, getLocaleTimezoneFormats, getLocaleDateTimeFormats,
} from '../../environment';
import utcTime from '../../baseContext/utcTime';
import { datetime, timezone } from '../../types';
import { isDatetime, isTimezone } from '../../types/util';
import { findPatternIndexBy, nilValue } from '../../util';


const groupByPatternLength = pipe(
  groupBy(pipe(prop('pattern'), length)),
  toPairs,
  sortBy(head),
  map(last),
  reverse
);


const isoDate = [YYYY, dash, MM, dash, DD];

const isolikeDateDash = [YYYY, dash, M, dash, D];
const isolikeDateSlash = [YYYY, slash, M, slash, D];

const euroDateNoYearDash = [D, dash, MM];
const euroDateNoYearSlash = [D, slash, MM];
const euroDateShortYearDash = [...euroDateNoYearDash, dash, YY];
const euroDateShortYearSlash = [...euroDateNoYearSlash, slash, YY];
const euroDateLongYearDash = [...euroDateNoYearDash, dash, YYYY];
const euroDateLongYearSlash = [...euroDateNoYearSlash, slash, YYYY];

const americanDateNoYearDash = [MM, dash, D];
const americanDateNoYearSlash = [MM, slash, D];
const americanDateShortYearDash = [...americanDateNoYearDash, dash, YY];
const americanDateShortYearSlash = [...americanDateNoYearSlash, slash, YY];
const americanDateLongYearDash = [...americanDateNoYearDash, dash, YYYY];
const americanDateLongYearSlash = [...americanDateNoYearSlash, slash, YYYY];


const resolveIsoDate = tags =>
  ({ years: textNumber(tags[0]), months: textNumber(tags[2]) - 1, date: textNumber(tags[4]) });
const resolveEuroNoYearDate = tags =>
  ({ months: textNumber(tags[2]) - 1, date: textNumber(tags[4]) });
const resolveEuroShortYearDate = tags =>
  ({ years: shortYear(tags[4]), months: textNumber(tags[2]) - 1, date: textNumber(tags[4]) });
const resolveEuroLongYearDate = tags =>
  ({ years: textNumber(tags[4]), months: textNumber(tags[2]) - 1, date: textNumber(tags[0]) });
const resolveAmericanNoYearDate = tags =>
  ({ months: textNumber(tags[0]) - 1, date: textNumber(tags[2]) });
const resolveAmericanShortYearDate = tags =>
  ({ years: shortYear(tags[4]), months: textNumber(tags[0]) - 1, date: textNumber(tags[2]) });
const resolveAmericanLongYearDate = tags =>
  ({ years: textNumber(tags[4]), months: textNumber(tags[0]) - 1, date: textNumber(tags[2]) });

const baseDateFormats = [
  // FIXME: Should have resolvers too
  { format: 'ISO_DATE', pattern: isoDate, resolve: resolveIsoDate },
  { format: 'DATE', pattern: isolikeDateDash, resolve: resolveIsoDate },
  { format: 'DATE', pattern: isolikeDateSlash, resolve: resolveIsoDate },
  { format: 'DATE', pattern: euroDateNoYearDash, resolve: resolveEuroNoYearDate },
  { format: 'DATE', pattern: euroDateNoYearSlash, resolve: resolveEuroNoYearDate },
  { format: 'DATE', pattern: euroDateShortYearDash, resolve: resolveEuroShortYearDate },
  { format: 'DATE', pattern: euroDateShortYearSlash, resolve: resolveEuroShortYearDate },
  { format: 'DATE', pattern: euroDateLongYearDash, resolve: resolveEuroLongYearDate },
  { format: 'DATE', pattern: euroDateLongYearSlash, resolve: resolveEuroLongYearDate },
  { format: 'DATE', pattern: americanDateNoYearDash, resolve: resolveAmericanNoYearDate },
  { format: 'DATE', pattern: americanDateNoYearSlash, resolve: resolveAmericanNoYearDate },
  { format: 'DATE', pattern: americanDateShortYearDash, resolve: resolveAmericanShortYearDate },
  { format: 'DATE', pattern: americanDateShortYearSlash, resolve: resolveAmericanShortYearDate },
  { format: 'DATE', pattern: americanDateLongYearDash, resolve: resolveAmericanLongYearDate },
  { format: 'DATE', pattern: americanDateLongYearSlash, resolve: resolveAmericanLongYearDate },
];


const isoTimeFullMs = [hh, colon, mm, colon, s, dot, ms];
const isoTimeFull = [hh, colon, mm, colon, s];
const isoTime = [hh, colon, mm];

const resolveIsoTimeFullMs = tags => ({ hours: textNumber(tags[0]), minutes: textNumber(tags[2]), seconds: textNumber(tags[4]), milliseconds: textNumber(tags[6]) });
const resolveIsoTimeFull = tags => ({ hours: textNumber(tags[0]), minutes: textNumber(tags[2]), seconds: textNumber(tags[4]) });
const resolveIsoTime = tags => ({ hours: textNumber(tags[0]), minutes: textNumber(tags[2]) });

const baseTimeFormats = [
  { format: 'ISO_TIME', pattern: isoTimeFullMs, resolve: resolveIsoTimeFullMs },
  { format: 'ISO_TIME', pattern: isoTimeFull, resolve: resolveIsoTimeFull },
  { format: 'ISO_TIME', pattern: isoTime, resolve: resolveIsoTime },
];


// Timezones
const isoTzOffsetFull = [plusMinus, hh, colon, mm];
const isoTzOffsetFullCompact = [plusMinus, hhmm];
const isoTzOffsetShort = [plusMinus, hh];
const isoTzOffsetUtc = [pipe(text, equals('z'))];

const directionFromPm = ifElse(plus, always(1), always(-1));
const resolveIsoOffsetTzFull = tags => ({
  offset: directionFromPm(tags[0]) * (60 * textNumber(tags[1]) + textNumber(tags[3])),
  timezone: 'UTC',
});
const resolveIsoOffsetTzFullCompact = tags => ({
  offset: directionFromPm(tags[0]) *
    (60 * Number(tags[1][0].substring(0, 2)) + Number(tags[1][0].substring(2, 4))),
  timezone: 'UTC',
});
const resolveIsoTzOffsetShort = tags =>
  ({ offset: directionFromPm(tags[0]) * 60 * textNumber(tags[1]), timezone: 'UTC' });
const resolveIsoTzOffsetUtc = always({ offset: 0, timezone: 'UTC' });

const baseTimezoneFormats = [
  { format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetFull, resolve: resolveIsoOffsetTzFull },
  { format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetFullCompact, resolve: resolveIsoOffsetTzFullCompact },
  { format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetShort, resolve: resolveIsoTzOffsetShort },
  { format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetUtc, resolve: resolveIsoTzOffsetUtc },
];


// Find dates, times, and then try to combine
const isIsoDate = whereEq({ format: 'ISO_DATE' });
const isIsoTime = whereEq({ format: 'ISO_TIME' });
const isIsoTimezoneOffset = whereEq({ format: 'ISO_TIMEZONE_OFFSET' });
const isDate = whereEq({ type: TAG_DATE });
const isTime = whereEq({ type: TAG_TIME });

const isoDateTime = [isIsoDate, t, isIsoTime];
const isoDateTimeTzOffset = [...isoDateTime, isIsoTimezoneOffset];
const timeTz = [isTime, isTimezone];
const dateTz = [isDate, isTimezone];
const dateTime = [isTime, isDate]; // Maybe locale?
const dateTimeTz = [...dateTime, isTimezone];

const resolveIsoDateTime = tags =>
  ({ ...tags[0].value, ...tags[2].value, timezone: 'UTC' });
const resolveIsoDateTimeTzOffset = tags =>
  ({ ...resolveIsoDateTime(tags), ...tags[3].value, timezone: 'UTC' });
const resolveDateTzTimeTz = tags =>
  ({ ...tags[0].value, ...tags[1].value });
const resolveDateTime = tags =>
  ({ ...tags[0].value, ...tags[1].value });
const resolveDateTimeTz = tags =>
  ({ ...resolveDateTime(tags), ...tags[2].value });

const baseDateTimeFormats = [
  { format: 'ISO_DATE_TIME', pattern: isoDateTimeTzOffset, resolve: resolveIsoDateTimeTzOffset },
  { format: 'ISO_DATE_TIME', pattern: isoDateTime, resolve: resolveIsoDateTime },
  { format: 'DATE_TIME', pattern: dateTz, resolve: resolveDateTzTimeTz },
  { format: 'DATE_TIME', pattern: timeTz, resolve: resolveDateTzTimeTz },
  { format: 'DATE_TIME', pattern: dateTimeTz, resolve: resolveDateTimeTz },
  { format: 'DATE_TIME', pattern: dateTime, resolve: resolveDateTime },
];


const splice = curry((start, count, value, array) =>
  insert(start, value, remove(start, count, array)));

function findSubPattern(type, context, patterns) {
  const { tags } = context;

  const availablePatterns = pipe(
    map((pattern) => ({
      patternIndex: findPatternIndexBy(pattern.pattern, tags),
      pattern,
    })),
    reject(whereEq({ patternIndex: -1 }))
  )(patterns);

  const availablePatternsLength = length(availablePatterns);

  // TODO: resolve ambiguities (euro/american, 24h time (isodate) vs 12h etc.)
  // if (availablePatternsLength > 1) {
  //   console.log(availablePatterns);
  //   throw new Error('ambigious');
  // }

  if (availablePatternsLength >= 1) { // || availablePatternsLength === 1) {
    const { pattern, patternIndex } = head(availablePatterns);
    const spliceCount = pattern.pattern.length;
    const capturedTags = slice(patternIndex, patternIndex + spliceCount, tags);
    const value = {
      type,
      format: pattern.format,
      value: pattern.resolve(capturedTags),
      start: head(capturedTags).start,
      end: last(capturedTags).end,
    };
    const newTags = splice(patternIndex, spliceCount, value, tags);

    return findSubPattern(type, { ...context, tags: newTags }, patterns);
  }

  return context;
}

const parsePattern = (type, patterns) => reduce(partial(findSubPattern, [type]), __, patterns);

const isDateOrTimeTag = anyPass([isDate, isTime]);
const isDateValue = anyPass([isDatetime, isTimezone]);
const containsAdjacentDateTags = pipe(findPatternIndexBy([isDateValue, isDateValue]), gte(__, 0));

const formatDateTimeTags = over(
  lensProp('tags'),
  pipe(
    map(when(isDateOrTimeTag, assoc('type', datetime.type))),
    when(containsAdjacentDateTags, nilValue)
  )
);

export default function parseDates(context) {
  const dateFormats = groupByPatternLength([...baseDateFormats, ...getLocaleDateFormats(context)]);
  const timeFormats = groupByPatternLength([...baseTimeFormats, ...getLocaleTimeFormats(context)]);
  const timezoneFormats = groupByPatternLength([...baseTimezoneFormats, ...getLocaleTimezoneFormats(context)]);
  const dateTimeFormats = groupByPatternLength([...baseDateTimeFormats, ...getLocaleDateTimeFormats(context)]);

  return pipe(
    // Dates before timezone offsets because dates can parse as multiple timezones
    // (1992-12-12 is 1992 and two timezone offsets)
    parsePattern(TAG_DATE, dateFormats),
    // Timezones offsets before times because timezone offsets can parse as times
    // (+03:45 could be '+' and a time)
    parsePattern(timezone.type, timezoneFormats),
    parsePattern(TAG_TIME, timeFormats),
    parsePattern(datetime.type, dateTimeFormats),
    formatDateTimeTags,
    when(whereEq({ tags: null }), always(context)),
    evolve({
      tags: map(when(isDatetime, datetimeValue => ({
        type: TAG_DATETIME,
        start: datetimeValue.start,
        end: datetimeValue.end,
        value: {
          type: datetimeValue.type,
          format: datetimeValue.format,
          value: { ...utcTime, ...context.currentTime, ...datetimeValue.value },
        },
      }))),
    })
  )(context);
}
