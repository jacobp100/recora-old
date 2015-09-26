#!/usr/bin/env node

const Recora = require('./dist/recora');

const text = process.argv.slice(2).join(' ');

const recora = new Recora();
const output = recora.parse(text);

console.log(text);

if (output.result) {
  console.log('->', output.result);
} else {
  console.log('Failed to solve query');
}
