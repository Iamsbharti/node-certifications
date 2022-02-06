const { test } = require("tap");
const req = require("../req");

test("handles network errors", ({ strictDeepEqual, end }) => {
  req("http://error.com", (err) => {
    strictDeepEqual(err, Error("network error"));
    end();
  });
});

test("responds with data", ({ ok, strictDeepEqual, ifError, end }) => {
  req("http://example.com", (err, data) => {
    ifError(err);
    ok(Buffer.isBuffer(data));
    strictDeepEqual(data, Buffer.from("some data"));
    end();
  });
});
/**
 * this time we are not using async function, since we are using callbacks,
 * it's much easier to call a final callback to signify to the test function that
 * we have finished testing.
 */

// run ./node_modules/.bin/tap-> will execute all the test file in cwd [test].

/**
 * saurabhbharti@Sb-m-neo pureLibaryTestModule % ./node_modules/.bin/tap
 * 
    ​PASS ​ testTap/add.test.js 6 OK 17.849ms
    testTap/req.test.js 2> (node:2940) DeprecationWarning: strictDeepEqual() is deprecated, use strictSame() instead
    testTap/req.test.js 2> (Use `node --trace-deprecation ...` to show where the warning was created)
    testTap/req.test.js 2> (node:2940) DeprecationWarning: ifError() is deprecated, use error() instead
    ​PASS ​ testTap/req.test.js 4 OK 632.887ms


                            
    🌈 SUMMARY RESULTS 🌈  
                            

    Suites:   ​2 passed​, ​2 of 2 completed​
    Asserts:  ​​​10 passed​, ​of 10​
    ​Time:​   ​2s​
    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
    add.js    |     100 |      100 |     100 |     100 |                   
    req.js    |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------

saurabhbharti@Sb-m-neo pureLibaryTestModule % 
 */
