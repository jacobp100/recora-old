import parse from './parse';
import baseContext from './baseContext';
import utcTime from './baseContext/utcTime';

// TODO: Functions for differentation, sum (sigma), and multiplication (pi)
// TODO: mapObj -> map, createMapEntry -> objOf

export default class Recora {
  constructor(locale, config = {}) {
    this.locale = locale || 'en';

    const now = new Date();

    const configUtcTime = config.utcTime || {};

    this.config = {
      ...config,
      utcTime: {
        ...utcTime,
        // FIXME: Pass this in properly
        years: now.getUTCFullYear(),
        months: now.getUTCMonth(),
        date: now.getUTCDate(),
        hours: now.getUTCHours(),
        minutes: now.getUTCMinutes(),
        timezone: 'Europe/London',
        utcOffset: 0,
        ...configUtcTime,
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
