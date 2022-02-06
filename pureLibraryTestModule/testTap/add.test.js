const { test } = require("tap");
const add = require("../add");

test("throws when i/p are not numbers", async ({ throws }) => {
  throws(() => add("5", "5"), Error("inputs must be numbers"));
  throws(() => add(5, "5"), Error("inputs must be numbers"));
  throws(() => add("5", 5), Error("inputs must be numbers"));
  throws(() => add({}, null), Error("inputs must be numbers"));
});

/**
 * The first argument passed to test is a string describing that group of assertions,
 * the second argument is an async function.
 *
 * We use an async function because it returns a promise and the test function
 * will use the promise returned from the async function to determine when the
 * test has finished for that group of assertions.
 *
 * So when the returned promise resolves, the test is done. Since we don't do anything
 * asynchronous, the promise essentially resolves at the end of the function.
 */
test("adds 2 numbers", async ({ equal }) => {
  equal(add(3, 3), 6);
  equal(add(-5, 5), 0);
});
/**
 * here we destructure equal method , this is different from equal of assert ,
 * this is by default a deep equality check.
 */
// run tests with -> testTap/add.test.js
// o/p format is known Test Anything Protocol (TAP). is platform and lang- independent
// test o/p format.
/**
 * TAP version 13
# Subtest: throws when i/p are not numbers
    ok 1 - expected to throw: Error inputs must be numbers
    ok 2 - expected to throw: Error inputs must be numbers
    ok 3 - expected to throw: Error inputs must be numbers
    ok 4 - expected to throw: Error inputs must be numbers
    1..4
ok 1 - throws when i/p are not numbers # time=13.496ms

# Subtest: adds 2 numbers
    ok 1 - should be equal
    ok 2 - should be equal
    1..2
ok 2 - adds 2 numbers # time=1.166ms

1..2
# time=22.891ms
 */

// tap also has a test runner executable
// -> node_modules/.bin/tap testTap/add.test.js

/**
 * saurabhbharti@Sb-m-neo pureLibaryTestModule % ./node_modules/.bin/tap testTap/add.test.js 
    ​ PASS ​ testTap/add.test.js 6 OK 17.52ms


                            
    🌈 SUMMARY RESULTS 🌈  
                            

    Suites:   ​1 passed​, ​1 of 1 completed​
    Asserts:  ​​​6 passed​, ​of 6​
    ​Time:​   ​1s​
    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
    ----------|---------|----------|---------|---------|-------------------
    All files |     100 |      100 |     100 |     100 |                   
    add.js    |     100 |      100 |     100 |     100 |                   
    ----------|---------|----------|---------|---------|-------------------
  saurabhbharti@Sb-m-neo pureLibaryTestModule % 
 */
