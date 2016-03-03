import { __, has, all, propOr } from 'ramda';
import parse from './parse';
import baseContext from './baseContext';
import utcTime from './baseContext/utcTime';

// TODO: mapObj -> map, createMapEntry -> objOf

export default class Recora {
  constructor(locale, config = {}) {
    this.locale = locale || 'en';

    let currentTime = null;

    const importantTimeValuesSatisfied = all(has(__, config), [
      'currentYear',
      'currentMonth',
      'currentDate',
    ]);

    if (importantTimeValuesSatisfied) {
      currentTime = {
        years: propOr(utcTime.years, 'currentYear', config),
        months: propOr(utcTime.months, 'currentMonth', config),
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
