require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('kilometers in 1 mile')));
