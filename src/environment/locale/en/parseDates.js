import { text, colon, h, mm, D } from '../../../parse/parseDates/formats';

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


// https://github.com/ericpp/hippyvm/blob/9e3921e3cfe41c260e65444d9097c2f298191930/hippy/module/date/lib/fallbackmap.h
// This will change GMT to BST in summer---is this a good idea?
const timezoneAbbreviations = {
  'sst': 'Pacific/Apia',
  'hst': 'Pacific/Honolulu',
  'akst': 'America/Anchorage',
  'akdt': 'America/Anchorage',
  'pst': 'America/Los_Angeles',
  'pdt': 'America/Los_Angeles',
  'mst': 'America/Denver',
  'mdt': 'America/Denver',
  'cst': 'America/Chicago',
  'cdt': 'America/Chicago',
  'est': 'America/New_York',
  'edt': 'America/New_York',
  'ast': 'America/Halifax',
  'adt': 'America/Halifax',
  'brt': 'America/Sao_Paulo',
  'brst': 'America/Sao_Paulo',
  'azost': 'Atlantic/Azores',
  'azodt': 'Atlantic/Azores',
  'gmt': 'Europe/London',
  'bst': 'Europe/London',
  'cet': 'Europe/Paris',
  'cest': 'Europe/Paris',
  'eet': 'Europe/Helsinki',
  'eest': 'Europe/Helsinki',
  'msk': 'Europe/Moscow',
  'msd': 'Europe/Moscow',
  'gst': 'Asia/Dubai',
  'pkt': 'Asia/Karachi',
  'ist': 'Asia/Kolkata',
  'npt': 'Asia/Katmandu',
  'yekt': 'Asia/Yekaterinburg',
  'novst': 'Asia/Novosibirsk',
  'krat': 'Asia/Krasnoyarsk',
  'krast': 'Asia/Krasnoyarsk',
  'jst': 'Asia/Tokyo',
  'nzst': 'Pacific/Auckland',
  'nzdt': 'Pacific/Auckland',
};

const tz = [pipe(text, has(__, timezoneAbbreviations))];

const resolveTz = tags => ({ timezone: timezoneAbbreviations[tags[0][0]] });

export const timezoneFormats = [
  { format: 'TIMEZONE', pattern: tz, resolve: resolveTz },
];
