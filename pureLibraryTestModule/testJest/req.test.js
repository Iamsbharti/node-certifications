const req = require("../req");

test("handles network errors", (done) => {
  req("http://error.com", (err) => {
    expect(err).toStrictEqual(Error("network error"));
    done();
  });
});

test("responds with data", (done) => {
  req("http://error/com", (err, data) => {
    expect(err === null).toBe(true);
    expect(Buffer.isBuffer(data)).toBe(true);
    expect(data).toStrictEqual(Buffer.from("some data"));
    done();
  });
});

/**
 * as tap we don't use async , but use a callback (done) to the functions that are passed
 * to test to signal that the test grou is complete.
 */

/**
 * saurabhbharti@Sb-m-neo pureLibraryTestModule % ./node_modules/.bin/jest testJest/req.test.js --coverage
 * 
    PASS  testJest/req.test.js
    ✓ handles network errors (311 ms)
    ✓ responds with data (303 ms)

    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
    req.js    |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        1.153 s, estimated 6 s
    Ran all test suites matching /testJest\/req.test.js/i.

saurabhbharti@Sb-m-neo pureLibraryTestModule % 
 */
