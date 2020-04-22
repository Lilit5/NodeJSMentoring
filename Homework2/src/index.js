const readline = require('readline');
const fs = require('fs');
const byline = require('byline');
const csvjson = require('csvjson');

// Task 1.1
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const reverseString = (str) => str.split("").reverse().join("");
console.log("Enter something...");
rl.on('line', (line) => {
  console.log(reverseString(line));
  console.log("Enter something...");
});

// Task 2
const csvPath = 'src/data/nodejs-hw1-ex1.csv';
const jsonPath = 'src/data/nodejs-hw1-ex2.txt';

const stream = byline(fs.createReadStream(csvPath));
const writable = fs.createWriteStream(jsonPath);
let lineCounter = 0;
let firstLine;
stream.on('data', line => {
  if (lineCounter == 0) {
    firstLine = line.toString()
  } else {
    const jsonLine = csvjson.toObject(firstLine + "\n" + line.toString(), { delimiter: ',' });
    writable.write(JSON.stringify(...jsonLine) + "\n");
  }
  lineCounter++;
});

stream.on('error', err => {
  throw new Error(`While reading file: ${csvPath} occurred an error: ${er}`);
})