const add = require("../add");

test("throws when input are not numbers", async () => {
  expect(() => add("5", "5")).toThrowError(Error("inputs must be numbers"));
  expect(() => add(5, "5")).toThrowError(Error("inputs must be numbers"));
  expect(() => add("5", 5)).toThrowError(Error("inputs must be numbers"));
  expect(() => add({}, null)).toThrowError(Error("inputs must be numbers"));
});

test("adds two numbers", async () => {
  expect(add(5, 5)).toStrictEqual(10);
  expect(add(-5, 5)).toStrictEqual(0);
});

/**
 * test function is not loaded with any modules, since this is made available
 * implicilty by ject at execution time. same applies for expect.
 */

// we can't run jest's tests with node directly even is it's explicilty available unlike TAP.
// we need to use ./node_modules/.bin/jest testJest/add.test.js
/**
 * saurabhbharti@Sb-m-neo pureLibraryTestModule % ./node_modules/.bin/jest testJest/add.test.js 
    PASS  testJest/add.test.js
    ✓ throws when input are not numbers (10 ms)
    ✓ adds two numbers (7 ms)

    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        0.539 s
    Ran all test suites matching /testJest\/add.test.js/i.
 */

// coverage is not added by default , --coverage flag can be used.

/**
 * saurabhbharti@Sb-m-neo pureLibraryTestModule % ./node_modules/.bin/jest testJest/add.test.js --coverage
    PASS  testJest/add.test.js
    ✓ throws when input are not numbers (10 ms)
    ✓ adds two numbers (1 ms)

    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
    add.js    |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------
    Test Suites: 1 passed, 1 total
    Tests:       2 passed, 2 total
    Snapshots:   0 total
    Time:        0.643 s, estimated 1 s
    Ran all test suites matching /testJest\/add.test.js/i.
saurabhbharti@Sb-m-neo pureLibraryTestModule % 
 */
