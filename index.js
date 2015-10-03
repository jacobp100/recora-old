import parse from './parse';

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
      hints: null,
      tags: null,
      ast: null,
      conversion: null,
      result: null,
      resultToString: '',
    };
    return parse(context) || context;
  }
}
