const req = require("../req-prom");

// make jest worth with nodes SetTimeout instead if overriding it

global.setTimeout = require("timers").setTimeout;

test("handles network errors", async () => {
  await expect(req("http://error.com")).rejects.toStrictEqual(
    Error("network error")
  );
});

test("responds with data", async () => {
  const data = await req("http://example.com");
  expect(Buffer.isBuffer(data)).toBeTruthy();
  expect(data).toStrictEqual(Buffer.from("some data"));
});

// we can run jest without any file names
