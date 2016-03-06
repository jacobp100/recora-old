import { __, has, all, propOr, pickBy } from 'ramda';
import parse from './parse';
import baseContext from './baseContext';
import utcTime from './baseContext/utcTime';
import { notNil } from './util';

// TODO: mapObj -> map, createMapEntry -> objOf

export default class Recora {
  constructor(locale, config = {}) {
    this.locale = locale || 'en';

    let { currentTime } = config || {};

    const importantTimeValuesSatisfied = all(has(__, currentTime), [
      'year',
      'month',
      'date',
    ]);

    if (importantTimeValuesSatisfied) {
      currentTime = {
        years: propOr(utcTime.years, 'year', currentTime),
        months: propOr(utcTime.months, 'month', currentTime),
        date: propOr(utcTime.date, 'date', currentTime),
        hours: propOr(utcTime.hours, 'hours', currentTime),
        minutes: propOr(utcTime.minutes, 'minutes', currentTime),
        timezone: propOr(utcTime.timezone, 'timezone', currentTime),
        utcOffset: propOr(utcTime.utcOffset, 'utcOffset', currentTime),
      };
    } else {
      currentTime = {};
    }

    this.config = pickBy(notNil, {
      si: propOr(null, 'si', config),
      units: propOr(null, 'units', config),
      constants: propOr(null, 'constants', config),
      currentTime,
    });
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
