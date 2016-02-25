require('babel/register')({
  stage: 0,
});

global.print = require('./src/debug/print');
