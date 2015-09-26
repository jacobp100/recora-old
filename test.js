require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('1 meter * (1 yard + -1 mile) + 1 foot 7 inch')));
