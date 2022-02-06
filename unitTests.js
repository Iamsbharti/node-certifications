/** Writing unit tests *********/

/**
 * Assertions are building block of unit and integration testing.
 * core "assert" module exports a function that will thorw an AssertionError when the value passed is
 * falsy.
 */
// node -e "assert(false)" -> throws err an instance of AssertionError.
// it will not throw anything if thruthy value is passed

/** Assertion Methods
 *    -  assert.ok(val) – the same as assert(val)
      -  assert.equal(val1, val2) – coercive equal, val1 == val2
      -  assert.notEqual(val1, val2) – coercive unequal, val1 != val2
      -  assert.strictEqual(val1, val2) – strict equal, val1 === val2
      -  assert.notStrictEqual(val1, val2) – strict unequal, val1 !== val2
      -  assert.deepEqual(obj1, obj2) – coercive equal for all values in an object
      -  assert.notDeepEqual(obj1, obj2) – coercive unequal for all values in an object
      -  assert.deepStrictEqual(obj1, obj2) – strict equal for all values in an object
      -  assert.notDeepStrictEqual(obj1, obj2) – strict unequal for all values in an object
      -  assert.throws(function) – assert that a function throws
      -  assert.doesNotThrow(function) – assert that a function doesn't throw
      -  assert.rejects(promise|async function) – assert promise or returned promise rejects
      -  assert.doesNotReject(promise|async function) – assert promise or returned promise resolves
      -  assert.ifError(err) – check that an error object is falsy
      -  assert.match(string, regex) – test a string against a regular expression
      -  assert.doesNotMatch(string, regex) – test that a string fails a regular expression
      -  assert.fail() – force an AssertionError to be thrown

 * methods can be grouped into :
      -  Truthiness (assert and assert.ok)
      -  Equality (strict and loose) and Pattern Matching (match)
      -  Deep equality (strict and loose)
      -  Errors (ifError plus throws, rejects and their antitheses)
      -  Unreachability (fail)
 */
function addFunction(a, b) {
  return a + b;
}
const assert = require("assert");
assert.equal(addFunction(2, 2), "4", "Coercive check not passed"); // is coercive check
assert.equal(
  typeof addFunction(2, 3),
  "number",
  "typeof coercive check not passed"
);
assert.strictEqual(addFunction(2, 2), 4, "strict equality not passed"); // strict check i.e value & type
assert.strict.equal(addFunction(2, 3), 5, "strict equal not passed");

// deepEquality checks
const obj = {
  id: 1,
  first: "start",
  last: "base",
};
// this assert will fail since objects are different
// assert.equal(obj, { id: 1, first: "star", last: "base" });

// to compare object structure use deepEqual, this is a coercive check
assert.deepEqual(obj, {
  id: "1",
  first: "start",
  last: "base",
}); // this will pass

// non coercive check
/** 
assert.deepStrictEqual(obj, {
  id: "1",
  first: "start",
  last: "base",
});
*/
/**
 * + actual - expected

  {
    first: 'start',
+   id: 1,
-   id: '1',
    last: 'base'
  }
 */
// we can use this too "assert.strict.deepEqual"

/**
 * The error handling assertions (throws, ifError, rejects) are useful
 * for asserting that error situations occur for synchronous,
 * callback-based and promise-based APIs.
 */
const add = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number") {
    throw Error("inputs must be numbers");
  }
  return a + b;
};
assert.throws(() => add(5, "4"), Error("inputs must be numbers"));
assert.doesNotThrow(() => add(5, 5));
/**
 * Notice that the invocation of add is wrapped inside another function.
 * This is because the assert.throws and assert.doesNotThrow methods have
 * to be passed a function, which they can then wrap and call to see
 * if a throw occurs or not.
 */

/**
 * For callback-based APIs, the assert.ifError will only pass if the value passed
 * to it is either null or undefined. Typically the err param is passed to it,
 * to ensure no errors occurred:
 */
const pseudoReq = (url, cb) => {
  setTimeout(() => {
    if (url === "http://error.com") cb(Error("network error"));
    else cb(null, Buffer.from("some data"));
  }, 300);
};

pseudoReq("http://example.com", (err, data) => {
  assert.ifError(err);
});

pseudoReq("http://error.com", (err, data) => {
  assert.deepStrictEqual(err, Error("network error"));
});

// promise based assertions
const { promisify } = require("util");
const timeout = promisify(setTimeout);
const pseudoReqAsync = async (url) => {
  await timeout(300);
  if (url === "http://error.com") throw Error("network error");
  return Buffer.from("some data");
};
assert.doesNotReject(pseudoReqAsync("http://example.com"));
assert.rejects(pseudoReqAsync("http://error.com"), Error("network error"));

/**
 * We can use assert.reject and assert.doesNotReject to test the success case
 * and the error case for a promise based function.
 * One caveat with these assertions is that they also return promises,
 * so in the case of an assertion error a promise will reject with an AssertionError
 * rather than AssertionError being thrown as an exception.
 */

// ****************************** Test Harness *************************** //
/**
 * if one of the asserted values fails to meet a condition an AssertionError is thrown,
 * which causes the process to crash.
 * 
 * This means the results of any assertions after that point are unknown,
 * but any additional assertion failures might be important information.
 * 
 * It would be great if we could group assertions together so that if one in 
 * a group fails, the failure is output to the terminal but the remaining groups 
 * of assertions still run.
 * 
 * for this use case Test Harness are used, there are 2 broad categories;
 *  -   Pure Library.
 *     "Pure library test harnesses provide a module, which is loaded into a 
 *      file and then used to group tests together. As we will see, pure libraries 
 *      can be executed directly with Node like any other code. This has the benefit 
 *      of easier debuggability and a shallower learning curve." (node-tap.org).
 * 
 *  -   Framework Environment
 *     "A test framework environment may provide a module or modules, 
 *      but it will also introduce implicit globals into the environment and 
 *      requires another CLI tool to execute tests so that these implicit 
 *      globals can be injected. For an example of a test framework environment 
 *      (jest)." 


 */
