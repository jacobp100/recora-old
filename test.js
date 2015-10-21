require('./mochahook');
// require('source-map-support').install();
const Recora = require('./src');

const recora = new Recora();

// console.log(JSON.stringify(recora.parse('2015-12-12T12:00:00.000+01:15 and also 12:00 28/12/1992 BST')));
console.log(JSON.stringify(recora.parse('10 + 10%')));
