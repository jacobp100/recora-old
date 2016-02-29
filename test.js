require('./mochahook');
// require('source-map-support').install();
const Recora = require('./src');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('1992/12/4 + 30 days')));
