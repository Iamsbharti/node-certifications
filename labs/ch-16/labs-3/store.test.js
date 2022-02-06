"use strict";
const store = require("./store");
test("test input error", async () => {
  await expect(store("")).rejects.toStrictEqual(
    Error("input must be a buffer")
  );
});

test("success await", async () => {
  const data = await store(Buffer.from("test"));
  expect(data.id.length).toStrictEqual(4);
});
