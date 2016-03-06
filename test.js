require('./mochahook');
// require('source-map-support').install();
const Recora = require('./src').default;

const recora = new Recora('en', { currentTime: { year: 2016, month: 3, date: 3 } });

console.log(JSON.stringify(recora.parse('x = 5')));
