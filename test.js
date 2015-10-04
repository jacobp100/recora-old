require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('3 feet 4 inches to cm')));
