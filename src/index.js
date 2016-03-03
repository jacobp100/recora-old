import { pick, all, propOr } from 'ramda';
import parse from './parse';
import baseContext from './baseContext';
import utcTime from './baseContext/utcTime';
import { notNil } from './util';

// TODO: mapObj -> map, createMapEntry -> objOf

export default class Recora {
  constructor(locale, config = {}) {
    this.locale = locale || 'en';

    let currentTime = null;

    const importantTimeValues = pick([
      'currentYears',
      'currentYonths',
      'currentYate',
    ], config);
    const importantTimeValuesSatisfied = all(notNil, importantTimeValues);

    if (importantTimeValuesSatisfied) {
      currentTime = {
        years: propOr(utcTime.years, 'currentYears', config),
        months: propOr(utcTime.months, 'currentMonths', config),
        date: propOr(utcTime.date, 'currentDate', config),
        hours: propOr(utcTime.hours, 'currentHours', config),
        minutes: propOr(utcTime.minutes, 'currentMinutes', config),
        timezone: propOr(utcTime.timezone, 'currentTimezone', config),
        utcOffset: propOr(utcTime.utcOffset, 'currentUtcOffset', config),
      };
    }

    this.config = {
      si: propOr(null, 'si', config),
      units: propOr(null, 'units', config),
      constants: propOr(null, 'constants', config),
      currentTime,
    };
  }

  getContext(text) {
    const { locale, config } = this;
    return {
      ...baseContext,
      ...config,
      locale,
      text,
    };
  }

  parse(text) {
    const context = this.getContext(text);
    return parse(context) || context;
  }
}
