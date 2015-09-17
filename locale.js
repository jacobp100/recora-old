import { merge, always, identity } from 'ramda';

/*
These functions are all in the locale 'en'. If we add more locales, we'll have to refactor this.
*/

export const getNumberFormat = always('\\d+');
export const getFormattingHints = merge({ hints: [] });
export const preprocessTags = identity;
