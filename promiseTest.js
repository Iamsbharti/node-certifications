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
const { readFile } = require("fs").promises;

readFile(__filename)
  .then((contents) => {
    return contents.toString();
  })
  .then((stringifiedContents) => {
    console.log(stringifiedContents);
  })
  .catch(console.error);
