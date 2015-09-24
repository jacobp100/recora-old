import parse from './parse';
import value from './types/value';

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
    };
    return parse(context);
  }
}
