import { text, plus, plusMinus, dash, slash, colon, dot, t, ms, s, mm, hh, hhmm, D, DD, MM, YY, YYYY } from './formats';
import { getLocaleDateFormats, getLocaleTimeFormats, getLocaleTimezoneOffsetFormats, getLocaleDateTimeFormats } from '../../environment';
import { findPatternIndexBy } from '../../util';


const groupByPatternLength = pipe(
  groupBy(pipe(prop('pattern'), length)),
  toPairs,
  sortBy(head),
  map(last),
  reverse,
);
const tagValue = tag => ((tag && tag[0]) ? Number(tag[0]) : NaN);


const isoDate = [YYYY, dash, MM, dash, DD];

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


const shortYear = pipe(
  tagValue,
  ifElse(lt(__, 50),
    add(2000),
    add(1900),
  ),
);

const resolveIsoDate = tags => ({ year: tagValue(tags[0]), month: tagValue(tags[2][0]), day: tagValue(tags[4]) });
const resolveEuroNoYearDate = tags => ({ month: tagValue(tags[2]), day: tagValue(tags[4]) });
const resolveEuroShortYearDate = tags => ({ year: shortYear(tags[4]), month: tagValue(tags[2]), day: tagValue(tags[4]) });
const resolveEuroLongYearDate = tags => ({ year: tagValue(tags[4]), month: tagValue(tags[2]), day: tagValue(tags[0]) });
const resolveAmericanNoYearDate = tags => ({ month: tagValue(tags[0]), day: tagValue(tags[2]) });
const resolveAmericanShortYearDate = tags => ({ year: shortYear(tags[4]), month: tagValue(tags[0]), day: tagValue(tags[2]) });
const resolveAmericanLongYearDate = tags => ({ year: tagValue(tags[4]), month: tagValue(tags[0]), day: tagValue(tags[2]) });

const baseDateFormats = [
  // FIXME: Should have resolvers too
  { name: 'ISO_DATE', format: 'ISO_DATE', pattern: isoDate, resolve: resolveIsoDate },
  { name: 'EURO_DATE_NO_YEAR_DASH', format: 'DATE', pattern: euroDateNoYearDash, resolve: resolveEuroNoYearDate },
  { name: 'EURO_DATE_NO_YEAR_SLASH', format: 'DATE', pattern: euroDateNoYearSlash, resolve: resolveEuroNoYearDate },
  { name: 'EURO_DATE_SHORT_YEAR_DASH', format: 'DATE', pattern: euroDateShortYearDash, resolve: resolveEuroShortYearDate },
  { name: 'EURO_DATE_SHORT_YEAR_SLASH', format: 'DATE', pattern: euroDateShortYearSlash, resolve: resolveEuroShortYearDate },
  { name: 'EURO_DATE_LONG_YEAR_DASH', format: 'DATE', pattern: euroDateLongYearDash, resolve: resolveEuroLongYearDate },
  { name: 'EURO_DATE_LONG_YEAR_SLASH', format: 'DATE', pattern: euroDateLongYearSlash, resolve: resolveEuroLongYearDate },
  { name: 'AMERICAN_DATE_NO_YEAR_DASH', format: 'DATE', pattern: americanDateNoYearDash, resolve: resolveAmericanNoYearDate },
  { name: 'AMERICAN_DATE_NO_YEAR_SLASH', format: 'DATE', pattern: americanDateNoYearSlash, resolve: resolveAmericanNoYearDate },
  { name: 'AMERICAN_DATE_SHORT_YEAR_DASH', format: 'DATE', pattern: americanDateShortYearDash, resolve: resolveAmericanShortYearDate },
  { name: 'AMERICAN_DATE_SHORT_YEAR_SLASH', format: 'DATE', pattern: americanDateShortYearSlash, resolve: resolveAmericanShortYearDate },
  { name: 'AMERICAN_DATE_LONG_YEAR_DASH', format: 'DATE', pattern: americanDateLongYearDash, resolve: resolveAmericanLongYearDate },
  { name: 'AMERICAN_DATE_LONG_YEAR_SLASH', format: 'DATE', pattern: americanDateLongYearSlash, resolve: resolveAmericanLongYearDate },
];


const isoTimeFullMs = [hh, colon, mm, colon, s, dot, ms];
const isoTimeFull = [hh, colon, mm, colon, s];
const isoTime = [hh, colon, mm];

const resolveIsoTimeFullMs = tags => ({ hour: tagValue(tags[0]), minute: tagValue(tags[2]), second: tagValue(tags[4]), millisecond: tagValue(tags[6]) });
const resolveIsoTimeFull = tags => ({ hour: tagValue(tags[0]), minute: tagValue(tags[2]), second: tagValue(tags[4]) });
const resolveIsoTime = tags => ({ hour: tagValue(tags[0]), minute: tagValue(tags[2]) });

const baseTimeFormats = [
  { name: 'ISO_TIME_FULL_MS', format: 'ISO_TIME', pattern: isoTimeFullMs, resolve: resolveIsoTimeFullMs },
  { name: 'ISO_TIME_FULL', format: 'ISO_TIME', pattern: isoTimeFull, resolve: resolveIsoTimeFull },
  { name: 'ISO_TIME', format: 'ISO_TIME', pattern: isoTime, resolve: resolveIsoTime },
];


// Timezone offsets only (fixed offsets from utc), not an actual timezones (which vary by date)
const isoTzOffsetFull = [plusMinus, hh, colon, mm];
const isoTzOffsetFullCompact = [plusMinus, hhmm];
const isoTzOffsetShort = [plusMinus, hh];
const isoTzOffsetUtc = [pipe(text, equals('z'))];

const directionFromPm = ifElse(plus, always(1), always(-1));
const resolveIsoTzFull = tags => ({ direction: directionFromPm(tags[0]), hour: tagValue(tags[1]), minute: tagValue(tags[3]) });
const resolveIsoTzFullCompact = tags => ({
  direction: directionFromPm(tags[0]),
  hour: Number(tags[1][0].substring(0, 2)),
  minute: Number(tags[1][0].substring(2, 4)),
});
const resolveIsoTzShort = tags => ({ direction: directionFromPm(tags[0]), hour: tagValue(tags[1]), minute: 0 });
const resolveIsoTzUtc = always({ direction: 1, hour: 0, minute: 0 });

const baseTimezoneOffsetFormats = [
  { name: 'ISO_TIMEZONE_OFFSET_FULL', format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetFull, resolve: resolveIsoTzFull },
  { name: 'ISO_TIMEZONE_OFFSET_FULL_COMPACT', format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetFullCompact, resolve: resolveIsoTzFullCompact },
  { name: 'ISO_TIMEZONE_OFFSET_SHORT', format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetShort, resolve: resolveIsoTzShort },
  { name: 'ISO_TIMEZONE_OFFSET_UTC', format: 'ISO_TIMEZONE_OFFSET', pattern: isoTzOffsetUtc, resolve: resolveIsoTzUtc },
];


// Find dates, times, and then try to combine
const isIsoDate = whereEq({ format: 'ISO_DATE' });
const isIsoTime = whereEq({ format: 'ISO_TIME' });
const isIsoTimezoneOffset = whereEq({ format: 'ISO_TIMEZONE_OFFSET' });
const isDate = whereEq({ format: 'DATE' });
const isTime = whereEq({ format: 'TIME' });

const isoDateTime = [isIsoDate, t, isIsoTime];
const isoDateTimeTz = [...isoDateTime, isIsoTimezoneOffset];
const dateTime = [isTime, isDate]; // Maybe locale?

const resolveIsoDateTime = tags => ({ ...tags[0].value, ...tags[2].value });
const resolveIsoDateTimeTz = tags => {
  const date = tags[0].value;
  const time = tags[2].value;
  const timezone = tags[3].value;

  return {
    ...date,
    ...time,
    timezone: 'UTC',
    hour: time.hour + timezone.direction * timezone.hour,
    minute: time.minute + timezone.direction * timezone.minute,
  };
};
const resolveDateTime = tags => ({ ...tags[0].value, ...tags[1].value });

const baseDateTimeFormats = [
  { name: 'ISO_DATE_TIME_TZ', format: 'ISO_DATE_TIME', pattern: isoDateTimeTz, resolve: resolveIsoDateTimeTz },
  { name: 'ISO_DATE_TIME', format: 'ISO_DATE_TIME', pattern: isoDateTime, resolve: resolveIsoDateTime },
  { name: 'DATE_TIME', format: 'DATE_TIME', pattern: dateTime, resolve: resolveDateTime },
];


const splice = curry((start, count, value, array) => insert(start, value, remove(start, count, array)));

function findSubPattern(type, context, patterns) {
  const { tags } = context;

  const availablePatterns = pipe(
    map((pattern) => ({
      patternIndex: findPatternIndexBy(pattern.pattern, tags),
      pattern,
    })),
    reject(whereEq({ patternIndex: -1 })),
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

export default function parseDates(context) {
  const dateFormats = groupByPatternLength([...baseDateFormats, ...getLocaleDateFormats(context)]);
  const timeFormats = groupByPatternLength([...baseTimeFormats, ...getLocaleTimeFormats(context)]);
  const timezoneOffsetFormats = groupByPatternLength([...baseTimezoneOffsetFormats, ...getLocaleTimezoneOffsetFormats(context)]);
  const dateTimeFormats = groupByPatternLength([...baseDateTimeFormats, ...getLocaleDateTimeFormats(context)]);

  return pipe(
    parsePattern('DATE', dateFormats),
    // Timezones before times because timezones can partially parse as times (+03:45 could be '+' and a time)
    parsePattern('TIMEZONE_OFFSET', timezoneOffsetFormats),
    parsePattern('TIME', timeFormats),
    // TODO: Regular timezones (PST/PDT to timezone names)
    parsePattern('DATE_TIME', dateTimeFormats),
    // TODO: Fill in missing information from current
    // year (make sure the date is in the future), month, day, timezone
    print(''),
  )(context);
}
