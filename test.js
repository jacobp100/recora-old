require('./mochahook');
// require('source-map-support').install();
const Recora = require('./src').default;

const recora = new Recora('en', { currentTime: { year: 2016, month: 3, date: 3 } });

console.log(JSON.stringify(recora.parse('1992/12/4 - 1 century')));
