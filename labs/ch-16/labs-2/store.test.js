"use strict";
const { test } = require("tap");
const store = require("./store");

test("test input error", ({ strictSame, end }) => {
  store("", (err) => {
    strictSame(err, Error("input must be a buffer"));
    end();
  });
});

test("returns a string from buffer", ({ ok, strictSame, error, end }) => {
  store(Buffer.from("test"), (err, data) => {
    error(err);
    strictSame(data.id.length, 4);
    end();
  });
});
