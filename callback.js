const { readFile } = require("fs");
const [bigFile, medFile, smallFile] = Array.from(Array(3).fill(__filename));

const print = (err, contents) => {
  if (err) {
    console.error("err:", err);
    return;
  }
  console.log(contents.toString());
};

/** Parallel execution of reading all 3 files */
console.log("************ PARALLEL EXECUTION *************");
readFile(bigFile, print);
readFile(medFile, print);
readFile(smallFile, print);

/** serial execution */
readFile(bigFile, (err, contents) => {
  console.log("************ SERIAL EXECUTION *************");
  print(err, contents);
  readFile(medFile, (err, contents) => {
    print(err, contents);
    readFile(smallFile, print);
  });
});

