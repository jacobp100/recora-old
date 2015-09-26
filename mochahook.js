require('babel/register')({
  stage: 0,
});

const ramda = require('ramda');

Object.assign(global, ramda);
