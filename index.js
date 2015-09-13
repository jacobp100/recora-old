import parse from './parse';

import units from './data/environment/units';

export default class Recora {
  constructor(locale) {
    this.locale = {
      numberFormat: '\\d+',
    };
    this.constants = {};
  }

  parse(text) {
    return parse.call(this, text);
  }

  getUnit(name) {
    if (units[name]) {
      return name;
    }
    return null;
  }

  preprocessTags(tags) {
    return tags;
  }

  getFormattingHints(tags) {
    return { tags, hints: [] };
  }
}
