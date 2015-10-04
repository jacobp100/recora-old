require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('1 gigajoules to kilowatt hours')));
