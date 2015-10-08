import units from '../units';
import si from '../data/environment/si';
import * as en from './locale/en';

const locales = { en };

export const getNumberFormat = always('\\d+(?:\\.\\d+)?'); // FIXME
export const parseNumber = (context, value) => Number(value.replace(',', '')); // FIXME
export const getFormattingHints = merge({ hints: [] }); // FIXME
export const getSiUnit = (context, name) => (path(['si', name], context) || si[name] || name);
export const getUnitValue = (context, name) => (path(['units', name], context) || units[name]);
export const getConstant = (context, name) => (path(['constants', name], context));
export const getUnitName = (context, name) => (locales[context.locale].getUnitName(context, name));
export const preprocessTags = (context) => (locales[context.locale].preprocessTags(context));
export const formatEntity = (context, entity, formattingHints) => (locales[context.locale].formatEntity(context, entity, formattingHints));