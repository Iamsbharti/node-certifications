/** 
const { readFile } = require("fs").promises;
const { promisify } = require("util");

const readFileAsync = promisify(readFile);

const promiseObject = readFileAsync(__filename);

promiseObject
  .then((data) => {
    console.log(data.toString());
  })
  .catch((err) => {
    console.error(err);
  });
*/
/**
const { readFile } = require("fs").promises;
readFile(__filename)
  .then((contents) => {
    return contents.toString();
  })
  .then((stringifiedContents) => {
    console.log(stringifiedContents);
  })
  .catch(console.error);
 * 
 */
/** 
// Promise.all
const { readFile } = require("fs").promises;
const files = Array.from(Array(3)).fill(__filename);

const print = (data) => {
  console.log(Buffer.concat(data).toString());
};
const readers = files.map((file) => readFile(file));

Promise.all(readers).then(print).catch(console.error);
*/
// Promise.allSettled
const { readFile } = require("fs").promises;
const files = [__filename, "not a file", __filename];

const print = (results) => {
  console.log("RESULTS::", results);
  results
    .filter(({ status }) => status === "rejected")
    .forEach(({ reason }) => console.log("REASON::", reason));
  const data = results
    .filter(({ status }) => status === "fulfilled")
    .map(({ value }) => value);
  const contents = Buffer.concat(data);
  console.log("========CONTENTS=======", contents.toString());
};
const readers = files.map((file) => readFile(file));

Promise.allSettled(readers).then(print).catch("Error::====>", console.error);
/** Promise.allSettled return a array of objects having status of promise and value
 *  promises with rejected status has a reason property.
 */
