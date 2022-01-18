"use strict";
const pino = require("pino");
const format = require("./format.js");
console.log(module.parent);
console.log(require.main);
if (require.main === module) {
  const logger = pino();
  console.log(format);
  logger.info(format.upper("my-pck started"));
  process.stdin.resume();
} else {
  const revStr = (str) => {
    return format.upper(str).split("").reverse().join("");
  };
  module.exports = revStr;
}
