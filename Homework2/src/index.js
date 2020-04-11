const readline = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');
const csvtojson = require("csvtojson");

// Task 1.1
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const reverseString = (str) => str.split("").reverse().join("");

rl.on('line', (line) => {
  console.log(reverseString(line));
});

// Task 2
const csvPath = 'src/data/nodejs-hw1-ex1.csv';
const jsonPath = 'src/data/nodejs-hw1-ex2.txt';

// const readInterface = readline.createInterface({
//   input: fs.createReadStream(csvPath),
//   output: process.stdout,
//   console: false
// });

const csvJson = csvtojson();
const writable = fs.createWriteStream(jsonPath);
let lineInJson;
try {
lineReader.eachLine(csvPath, (line) => {
  console.log("------------ ", line);
    console.log("w ***** ", writable);
      csvJson.fromString(line).pipe(writable);
      // lineInJson = await csvJson.fromString(line);
      // writable.write(lineInJson);
});
} catch (er) {
  console.log("ERROR: ", er);
}

// const writable = fs.createWriteStream(jsonPath);
// lineReader.open(csvPath, (err, reader) => {
//   if (reader.hasNextLine()) {
//     reader.nextLine((err, line) => {
//       if (err) throw new Error(`An error occurred while reading file ${csvPath}: ` + err);
//       console.log("aaaa", line);
//       writable.write(line);
//     });
//   } else {
//     console.log("aaaaaaaaaaaaaa");
//   }
// });


// const readable = fs.createReadStream(csvPath);
// const writable = fs.createWriteStream(jsonPath);
// const csvJson = csvtojson();
// readable.pipe(csvJson).pipe(writable);
//------------------------------------
// // try {
//   readInterface.on('line', function (line) {
//     console.log(line);
//   });
// // } catch (er) {
// //   throw new Error(`While reading file: ${csvPath} occurred an error: ${er}`);
// // }