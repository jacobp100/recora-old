require('babel/register')
require('source-map-support').install();
const Recora = require('./dist/recora');

const recora = new Recora();

console.log(JSON.stringify(recora.parse('how how brown cow')));
