import moment from 'moment-timezone';

const datetimeToMoment = datetime =>
  moment.tz(datetime.value, datetime.value.timezone).utcOffset(datetime.value.utcOffset);

export const toUtc = (context, datetime) => ({
  ...datetime,
  value: {
    ...datetimeToMoment(datetime).utc().toObject(),
    timezone: 'UTC',
    utcOffset: 0,
  },
});

export const convert = (context, timezone, datetime) => ({
  ...datetime,
  value: {
    ...datetimeToMoment(datetime).tz(timezone.value.timezone).toObject(),
    timezone: timezone.value.timezone,
    utcOffset: 0,
  },
});

export const normalize = (context, datetime) => ({
  ...datetime,
  value: {
    ...datetime.value,
    ...datetimeToMoment(datetime).toObject(),
  },
});

export function timestamp(context, datetime) {
  const { years, months, date, hours, minutes, seconds, milliseconds } = datetime.value;
  return Date.UTC(years, months, date, hours, minutes, seconds, milliseconds);
}

export function toString(context, datetime) {
  return datetimeToMoment(datetime).toString();
}
