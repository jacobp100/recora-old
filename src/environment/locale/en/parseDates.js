import { text, colon, h, mm, D } from '../../parse/parseDates/formats';

export const amPm = anyPass([ // FIXME: Locale
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

const MMMM = pipe(text, anyPass(map(match, MMMMFormats)));


const dateFormat = [D, MMMM];
const dateFormatLonger = [D, ordinal, MMMM];

export const dateFormats = [
  { name: 'DATE_FORMAT', format: 'DATE', pattern: dateFormat },
  { name: 'DATE_FORMAT_LONGER', format: 'DATE', pattern: dateFormatLonger },
];


const fullTime = [h, colon, mm, amPm];
const shortTime = [h, amPm];

export const timeFormats = [
  { name: 'FULL_TIME', format: 'TIME', pattern: fullTime },
  { name: 'SHORT_TIME', format: 'TIME', pattern: shortTime },
];
