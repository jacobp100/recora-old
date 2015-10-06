import parse from './parse';
import baseContext from './baseContext';

// TODO: Functions for differentation, sum (sigma), and multiplication (pi)

export default class Recora {
  constructor(locale) {
    this.locale = locale || 'en';
    this.constants = {};
  }

  parse(text) {
    const { locale, constants } = this;
    const context = {
      locale,
      text,
      constants,
      ...baseContext,
    };
    return parse(context) || context;
  }
}
