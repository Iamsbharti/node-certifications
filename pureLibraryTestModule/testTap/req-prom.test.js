const { test } = require("tap");
const req = require("../req-prom");

test("handles netwrok errors", async ({ rejects }) => {
  await rejects(req("http://error.com"), Error("network error"));
});

test("responds with data", async ({ ok, strictSame }) => {
  const data = await req("http://example.com");
  ok(Buffer.isBuffer(data)); // ok is slightly less noisy , we can use equal
  strictSame(data, Buffer.from("some data"));
});

/**
 * saurabhbharti@Sb-m-neo pureLibraryTestModule % ./node_modules/.bin/tap
 * 
    ​ PASS ​ testTap/add.test.js 6 OK 26.279ms
     testTap/req.test.js 2> (node:3005) DeprecationWarning: strictDeepEqual() is deprecated, use strictSame() instead
     testTap/req.test.js 2> (Use `node --trace-deprecation ...` to show where the warning was created)
     testTap/req.test.js 2> (node:3005) DeprecationWarning: ifError() is deprecated, use error() instead
    ​ PASS ​ testTap/req.test.js 4 OK 623.169ms
    ​ PASS ​ testTap/req-prom.test.js 3 OK 628.834ms


                            
    🌈 SUMMARY RESULTS 🌈  
                            

    Suites:   ​3 passed​, ​3 of 3 completed​
    Asserts:  ​​​13 passed​, ​of 13​
    ​Time:​   ​2s​
    -------------|---------|----------|---------|---------|-------------------
    File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    -------------|---------|----------|---------|---------|-------------------
    All files    |     100 |      100 |     100 |     100 |                   
    add.js       |     100 |      100 |     100 |     100 |                   
    req-prom.js  |     100 |      100 |     100 |     100 |                   
    req.js       |     100 |      100 |     100 |     100 |                   
    -------------|---------|----------|---------|---------|-------------------

saurabhbharti@Sb-m-neo pureLibraryTestModule % 
 */
