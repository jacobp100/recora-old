import parse from './parse';
import baseContext from './baseContext';
import utcTime from './baseContext/utcTime';

// TODO: Functions for differentation, sum (sigma), and multiplication (pi)
// TODO: mapObj -> map, createMapEntry -> objOf

import parseDates from './parse/parseDates';

export default class Recora {
  constructor(locale, config = {}) {
    this.locale = locale || 'en';

    const now = new Date();

    this.config = {
      ...config,
      utcTime: {
        ...utcTime,
        // FIXME: Pass this in properly
        year: now.getUTCFullYear(),
        month: now.getUTCMonth(),
        date: now.getUTCDate(),
        hour: now.getUTCHours(),
        minute: now.getUTCMinutes(),
        timezone: 'Europe/London',
        utcOffset: 0,
      },
    };
  }

  parse(text) {
    const { locale, config } = this;
    const context = {
      ...baseContext,
      ...config,
      locale,
      text,
    };
    return parse(context) || context;
  }
}
