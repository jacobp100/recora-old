import parse from './parse';
import baseContext from './baseContext';

// TODO: Functions for differentation, sum (sigma), and multiplication (pi)
// TODO: mapObj -> map, createMapEntry -> objOf

import parseDates from './parse/parseDates';

export default class Recora {
  constructor(locale) {
    this.locale = locale || 'en';
    this.units = {};
    this.constants = {};
  }

  parse(text) {
    const { locale, units, constants } = this;
    const context = {
      locale,
      text,
      units,
      constants,
      ...baseContext,
    };
    return parse(context) || context;
  }
}
