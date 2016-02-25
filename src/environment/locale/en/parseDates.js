/* eslint max-len: [0] */
import {
  pipe, equals, anyPass, test, map, findIndex, __, allPass, gt, lte, ifElse, head, has, prop,
  partition, zipObj, always,
} from 'ramda';
import timezones from '../../../data/en/timezones';
import timezoneOffsets from '../../../data/en/timezoneOffsets';
import { shortYear, colon, mm, D, YY, YYYY } from '../../../parse/parseDates/formats';
import { text, textNumber } from '../../../parse/tags/util';
import { lengthIsOne, notNaN } from '../../../util';


const am = pipe(text, equals('am'));
const pm = pipe(text, equals('pm'));
const amPm = anyPass([am, pm]);

const ordinal = pipe(
  text,
  test(/^(st|nd|rd|th)$/)
);

const MMMMFormats = [
  /^jan(uary)?$/,
  /^feb(ruary)?$/,
  /^mar(ch)?$/,
  /^apr(il)?$/,
  /^may$/,
  /^jun(e)?$/,
  /^aug(ust)?$/,
  /^sep(t(ember)?)?$/,
  /^oct(ober)?$/,
  /^nov(ember)?$/,
  /^dec(ember)?$/,
];

const matchesMMMMFormats = map(test, MMMMFormats);

const MMMM = pipe(text, anyPass(matchesMMMMFormats));
const mmmmIndex = tag => findIndex(test(__, text(tag)), MMMMFormats);


const dateFormat = [D, MMMM];
const dateFormatLonger = [D, ordinal, MMMM];
const dateFormatShortYear = [D, MMMM, YY];
const dateFormatLongerShortYear = [D, ordinal, MMMM, YY];
const dateFormatFullYear = [D, MMMM, YYYY];
const dateFormatLongerFullYear = [D, ordinal, MMMM, YYYY];
const dateFormatReversed = [MMMM, D];
const dateFormatReversedLonger = [MMMM, D, ordinal];
const dateFormatReversedShortYear = [MMMM, D, YY];
const dateFormatReversedLongerShortYear = [MMMM, D, ordinal, YY];
const dateFormatReversedFullYear = [MMMM, D, YYYY];
const dateFormatReversedLongerFullYear = [MMMM, D, ordinal, YYYY];

const resolveDateFormat = tags =>
  ({ months: mmmmIndex(tags[1]), date: textNumber(tags[0]) });
const resolveDateFormatLonger = tags =>
  ({ months: mmmmIndex(tags[2]), date: textNumber(tags[0]) });
const resolveDateFormatShortYear = tags =>
  ({ years: shortYear(tags[2]), months: mmmmIndex(tags[1]), date: textNumber(tags[0]) });
const resolveDateFormatLongerShortYear = tags =>
  ({ years: shortYear(tags[3]), months: mmmmIndex(tags[2]), date: textNumber(tags[0]) });
const resolveDateFormatFullYear = tags =>
  ({ years: textNumber(tags[2]), months: mmmmIndex(tags[1]), date: textNumber(tags[0]) });
const resolveDateFormatLongerFullYear = tags =>
  ({ years: textNumber(tags[3]), months: mmmmIndex(tags[2]), date: textNumber(tags[0]) });
const resolveDateFormatReversed = tags =>
  ({ months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });
const resolveDateFormatReversedLonger = tags =>
  ({ months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });
const resolveDateFormatReversedShortYear = tags =>
  ({ years: shortYear(tags[2]), months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });
const resolveDateFormatReversedLongerShortYear = tags =>
  ({ years: shortYear(tags[3]), months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });
const resolveDateFormatReversedFullYear = tags =>
  ({ years: textNumber(tags[2]), months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });
const resolveDateFormatReversedLongerFullYear = tags =>
  ({ years: textNumber(tags[3]), months: mmmmIndex(tags[0]), date: textNumber(tags[1]) });

export const dateFormats = [
  { format: 'DATE', pattern: dateFormat, resolve: resolveDateFormat },
  { format: 'DATE', pattern: dateFormatLonger, resolve: resolveDateFormatLonger },
  { format: 'DATE', pattern: dateFormatShortYear, resolve: resolveDateFormatShortYear },
  { format: 'DATE', pattern: dateFormatLongerShortYear, resolve: resolveDateFormatLongerShortYear },
  { format: 'DATE', pattern: dateFormatFullYear, resolve: resolveDateFormatFullYear },
  { format: 'DATE', pattern: dateFormatLongerFullYear, resolve: resolveDateFormatLongerFullYear },
  { format: 'DATE', pattern: dateFormatReversed, resolve: resolveDateFormatReversed },
  { format: 'DATE', pattern: dateFormatReversedLonger, resolve: resolveDateFormatReversedLonger },
  { format: 'DATE', pattern: dateFormatReversedShortYear, resolve: resolveDateFormatReversedShortYear },
  { format: 'DATE', pattern: dateFormatReversedLongerShortYear, resolve: resolveDateFormatReversedLongerShortYear },
  { format: 'DATE', pattern: dateFormatReversedFullYear, resolve: resolveDateFormatReversedFullYear },
  { format: 'DATE', pattern: dateFormatReversedLongerFullYear, resolve: resolveDateFormatReversedLongerFullYear },
];

const h12 = pipe(textNumber, allPass([
  notNaN,
  gt(__, 1),
  lte(__, 12),
]));
const fullTime = [h12, colon, mm, amPm];
const shortTime = [h12, amPm];

const resolveFullTime = ifElse(pipe(head, am),
  tags => ({ hours: textNumber(tags[0]), minutes: textNumber(tags[2]) }),
  tags => ({ hours: textNumber(tags[0]) + 12, minutes: textNumber(tags[2]) })
);

const resolveShortTime = ifElse(pipe(head, am),
  tags => ({ hours: textNumber(tags[0]), minutes: 0 }),
  tags => ({ hours: textNumber(tags[0]) + 12, minutes: 0 })
);

export const timeFormats = [
  { format: 'TIME', pattern: fullTime, resolve: resolveFullTime },
  { format: 'TIME', pattern: shortTime, resolve: resolveShortTime },
];


// Timezone offsets
const isTimezoneOffset = pipe(text, has(__, timezoneOffsets));
const timezoneOffset = [isTimezoneOffset];

const resolveTimezoneOffset = tags => ({ offset: timezoneOffsets[tags[0][0]], timezone: 'UTC' });

// Timezones
const wordsToPattern = map(word => pipe(text, equals(word)));

const propWords = prop('words');
const [singleWordTimezones, splitWordTimezones] =
  partition(pipe(propWords, lengthIsOne), timezones);
const singleWordTimezonesMap = zipObj(
  map(pipe(propWords, head), singleWordTimezones),
  map(prop('timezone'), singleWordTimezones)
);

// This is done for perf
const singleWordTimezone = [pipe(text, has(__, singleWordTimezonesMap))];
const resolveSingleWordTimezone = tags =>
  ({ timezone: singleWordTimezonesMap[tags[0][0]], utcOffset: 0 });

const splitWordTimezonesFromIana = map(({ timezone, words }) => ({
  format: 'TIMEZONE',
  pattern: wordsToPattern(words),
  resolve: always({ timezone, utcOffset: 0 }),
}), splitWordTimezones);

export const timezoneFormats = [
  ...splitWordTimezonesFromIana,
  { format: 'TIMEZONE', pattern: singleWordTimezone, resolve: resolveSingleWordTimezone },
  { format: 'TIMEZONE_OFFSET', pattern: timezoneOffset, resolve: resolveTimezoneOffset },
];
