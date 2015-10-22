import timezones from '../../../data/en/timezones';
import timezoneOffsets from '../../../data/en/timezoneOffsets';
import { text, textNumber, colon, mm, D } from '../../../parse/parseDates/formats';
import { lengthIsOne, notNaN } from '../../../util';


const am = pipe(text, equals('am'));
const pm = pipe(text, equals('pm'));
const amPm = anyPass([am, pm]);

const ordinal = pipe(
  text,
  match(/^(st|nd|rd|th)$/)
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

const matchesMMMMFormats = map(match, MMMMFormats);

const MMMM = pipe(text, anyPass(matchesMMMMFormats));


const dateFormat = [D, MMMM];
const dateFormatLonger = [D, ordinal, MMMM];

// FIXME: Resolvers
export const dateFormats = [
  { format: 'DATE', pattern: dateFormat },
  { format: 'DATE', pattern: dateFormatLonger },
];

const h12 = pipe(textNumber, allPass([
  notNaN,
  gt(__, 1),
  lte(__, 12),
]));
const fullTime = [h12, colon, mm, amPm];
const shortTime = [h12, amPm];

const resolveFullTime = ifElse(pipe(head, am),
  tags => ({ hour: textNumber(tags[0]), minute: textNumber(tags[2]) }),
  tags => ({ hour: textNumber(tags[0]) + 12, minute: textNumber(tags[2]) }),
);

const resolveShortTime = ifElse(pipe(head, am),
  tags => ({ hour: textNumber(tags[0]), minute: 0 }),
  tags => ({ hour: textNumber(tags[0]) + 12, minute: 0 }),
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
const [singleWordTimezones, splitWordTimezones] = partition(pipe(propWords, lengthIsOne), timezones);
const singleWordTimezonesMap = zipObj(
  map(pipe(propWords, head), singleWordTimezones),
  map(prop('timezone'), singleWordTimezones),
);

// This is done for perf
const singleWordTimezone = [pipe(text, has(__, singleWordTimezonesMap))];
const resolveSingleWordTimezone = tags => ({ timezone: singleWordTimezonesMap[tags[0][0]], utcOffset: 0 });

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
