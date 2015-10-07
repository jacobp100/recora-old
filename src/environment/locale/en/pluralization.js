const pluralMap = {
  'century': 'centuries',
  'inch': 'inches',
  'foot': 'feet',
  'us': 'us',
  'kelvin': 'kelvin',
  'celsius': 'celsius',
  'fahrenheit': 'fahrenheit',
  'gas': 'gas',
};
const singularMap = pipe(invert, mapObj(head))(pluralMap);

export function singularize(word) {
  const plural = word.toLowerCase().trim();

  if (singularMap[plural]) {
    return singularMap[plural];
  } else if (last(plural) === 's') {
    return init(plural);
  }
  return plural;
}

export function pluralize(word) {
  const singular = word.trim();
  return pluralMap[singular] || (singular + 's');
}
