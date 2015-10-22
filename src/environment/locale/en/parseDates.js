import timezones from '../../../data/en/timezones';
import timezoneOffsets from '../../../data/en/timezoneOffsets';
import { text, colon, h, mm, D } from '../../../parse/parseDates/formats';
import { lengthIsOne } from '../../../util';


export const amPm = anyPass([
  pipe(text, equals('am')),
  pipe(text, equals('pm')),
]);

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


const fullTime = [h, colon, mm, amPm];
const shortTime = [h, amPm];

export const timeFormats = [
  { format: 'TIME', pattern: fullTime },
  { format: 'TIME', pattern: shortTime },
];


const isTimezoneOffset = pipe(text, has(__, timezoneOffsets));
const timezoneOffset = [isTimezoneOffset];

const resolveTimezoneOffset = tags => ({ offset: timezoneOffsets[tags[0][0]] });

export const timezoneOffsetFormats = [
  { format: 'TIMEZONE_OFFSET', pattern: timezoneOffset, resolve: resolveTimezoneOffset },
];


const wordsToPattern = map(word => pipe(text, equals(word)));

const propWords = prop('words');
const [singleWordTimezones, splitWordTimezones] = partition(pipe(propWords, lengthIsOne), timezones);
const singleWordTimezonesMap = zipObj(
  map(pipe(propWords, head), singleWordTimezones),
  map(prop('timezone'), singleWordTimezones),
);

const singleWordTimezone = [pipe(text, has(__, singleWordTimezonesMap))];

const resolveSingleWordTimezone = tags => ({ timezone: singleWordTimezonesMap[tags[0][0]] });

const splitWordTimezonesFromIana = map(({ timezone, words }) => ({
  format: 'TIMEZONE',
  pattern: wordsToPattern(words),
  resolve: always({ timezone }),
}), splitWordTimezones);

export const timezoneFormats = [
  ...splitWordTimezonesFromIana,
  { format: 'TIMEZONE', pattern: singleWordTimezone, resolve: resolveSingleWordTimezone },
];
