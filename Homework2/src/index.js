const readline = require('readline');
const fs = require('fs');
const csvtojson = require("csvtojson");

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

try {
  const readable = fs.createReadStream(csvPath);
  const writable = fs.createWriteStream(jsonPath);
  const csvJson = csvtojson();
  readable.pipe(csvJson).pipe(writable);
} catch (er) {
  throw new Error(`While reading file: ${csvPath} occurred an error: ${er}`);
}