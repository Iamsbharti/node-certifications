const { test } = require("tap");
const uppercase = require("./uppercase");
test("test error case", async ({ throws }) => {
  throws(() => uppercase(78787), Error("input must be a string"));
});

test("returns uppercase", async ({ strictSame }) => {
  strictSame(uppercase("ad"), "AD");
});
