require('./mochahook');
// require('source-map-support').install();
const Recora = require('./src');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('12:00 28/12/1992 EST')));
