require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(recora.parse('1 meter to yard'));
