"use strict";
const { promisify } = require("util");

const print = (err, contents) => {
  if (err) console.error(err);
  else console.log(contents);
};

const opA = (cb) => {
  setTimeout(() => {
    cb(null, "A");
  }, 500);
};

const opB = (cb) => {
  setTimeout(() => {
    cb(null, "B");
  }, 250);
};

const opC = (cb) => {
  setTimeout(() => {
    cb(null, "C");
  }, 125);
};

const a = promisify(opA);
const b = promisify(opB);
const c = promisify(opC);

a.call(opA).then((content) => {
  print(null, content);
  b.call(opB).then((content) => {
    print(null, content);
    c.call(opC).then((content) => {
      print(null, content);
    });
  });
});
