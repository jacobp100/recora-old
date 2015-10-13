import { dash, slash, colon, dot, t, ms, mm, h, hh, D, DD, MM, YY, YYYY, tzOffsetRange, tzShort } from './formats';
import { getLocaleDateFormats, getLocaleTimeFormats, getLocaleDateTimeFormats } from '../../environment';
import { findPatternIndex } from '../../util';


const groupByPatternLength = pipe(
  groupBy(pipe(prop('pattern'), length)),
  toPairs,
  sortBy(head),
  map(last),
  reverse,
);


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

const baseDateFormats = [
  // FIXME: Should have resolvers too
  { name: 'ISO_DATE', format: 'ISO_DATE', pattern: isoDate },
  { name: 'EURO_DATE_NO_YEAR_DASH', format: 'DATE', pattern: euroDateNoYearDash },
  { name: 'EURO_DATE_NO_YEAR_SLASH', format: 'DATE', pattern: euroDateNoYearSlash },
  { name: 'EURO_DATE_SHORT_YEAR_DASH', format: 'DATE', pattern: euroDateShortYearDash },
  { name: 'EURO_DATE_SHORT_YEAR_SLASH', format: 'DATE', pattern: euroDateShortYearSlash },
  { name: 'EURO_DATE_LONG_YEAR_DASH', format: 'DATE', pattern: euroDateLongYearDash },
  { name: 'EURO_DATE_LONG_YEAR_SLASH', format: 'DATE', pattern: euroDateLongYearSlash },
  { name: 'AMERICAN_DATE_NO_YEAR_DASH', format: 'DATE', pattern: americanDateNoYearDash },
  { name: 'AMERICAN_DATE_NO_YEAR_SLASH', format: 'DATE', pattern: americanDateNoYearSlash },
  { name: 'AMERICAN_DATE_SHORT_YEAR_DASH', format: 'DATE', pattern: americanDateShortYearDash },
  { name: 'AMERICAN_DATE_SHORT_YEAR_SLASH', format: 'DATE', pattern: americanDateShortYearSlash },
  { name: 'AMERICAN_DATE_LONG_YEAR_DASH', format: 'DATE', pattern: americanDateLongYearDash },
  { name: 'AMERICAN_DATE_LONG_YEAR_SLASH', format: 'DATE', pattern: americanDateLongYearSlash },
];


const isoTimeFull = [hh, colon, mm, dot, ms];
const isoTime = [hh, colon, mm];
const isoTimeFullTzOffset = [...isoTimeFull, ...tzOffsetRange];
const isoTimeFullTzShort = [...isoTimeFull, tzShort];
const isoTimeTzOffset = [...isoTime, ...tzOffsetRange];
const isoTimeTzShort = [...isoTime, tzShort];

const basicTime = [h, colon, mm];

const baseTimeFormats = [
  { name: 'ISO_TIME_FULL', format: 'ISO_TIME', pattern: isoTimeFull },
  { name: 'ISO_TIME', format: 'ISO_TIME', pattern: isoTime },
  { name: 'ISO_TIME_TZ_OFFSET', format: 'ISO_TIME', pattern: isoTimeTzOffset },
  { name: 'ISO_TIME_TZ_SHORT', format: 'ISO_TIME', pattern: isoTimeTzShort },
  { name: 'ISO_TIME_FULL_TZ_OFFSET', format: 'ISO_TIME', pattern: isoTimeFullTzOffset },
  { name: 'ISO_TIME_FULL_TZ_SHORT', format: 'ISO_TIME', pattern: isoTimeFullTzShort },
  { name: 'BASIC_TIME', format: 'TIME', pattern: basicTime },
];


// Find dates, times, and then try to combine
const isIsoDate = whereEq({ format: 'ISO_DATE' });
const isIsoTime = whereEq({ format: 'ISO_TIME' });
const isDate = whereEq({ format: 'DATE' });
const isTime = whereEq({ format: 'TIME' });

const baseDateTimeFormats = [
  { name: 'ISO_DATE_TIME', format: 'ISO_DATE_TIME', pattern: [isIsoDate, t, isIsoTime] },
  { name: 'DATE_TIME', format: 'DATE_TIME', pattern: [isTime, isDate] },
];


const parsePattern = curry((context, patternGroup, tags) => {
  function findSubPattern(index) {
    const patterns = patternGroup[index];

    if (!patterns) {
      return tags;
    }

    const availablePatterns = pipe(
      map((pattern) => findPatternIndex(pattern.pattern, tags)),
      reject(equals(-1)),
    )(patterns);

    if (isEmpty(availablePatterns)) {
      return findSubPattern(index + 1);
    }

    // Resolve ambiguities (euro/american)
    // Slice pattern into tags
    return tags;
  }

  return findSubPattern(0);
});

export function parseDates(context, tags) {
  const dateFormats = groupByPatternLength([...baseDateFormats, ...getLocaleDateFormats(context)]);
  const timeFormats = groupByPatternLength([...baseTimeFormats, ...getLocaleTimeFormats(context)]);
  const dateTimeFormats = groupByPatternLength([...baseDateTimeFormats, ...getLocaleDateTimeFormats(context)]);

  return pipe(
    parsePattern(context, dateFormats),
    parsePattern(context, timeFormats),
    parsePattern(context, dateTimeFormats),
  )(tags);
}
