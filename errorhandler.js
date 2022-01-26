function doTask(amount) {
  if (typeof amount !== "number") {
    throw new Error("Amount should be a number");
  }
  return amount / 2;
}

doTask(1);
/**
 * When the program crashes, a stack trace is printed.
 * This stack trace comes from the error object we created straight after using
 * the throw keyword. The Error constructor is native to JavaScript,
 * and takes a string as the Error message, while auto generating a stack trace
 * when created.
 * While it's recommended to always throw object instantiated from Error
 * (or instantiated from a constructor that inherits from Error),
 * it is possible to throw any value:
 * e.g. throw ('any err msg.')
 * --trace-uncaught flag can be used to track the exception
 */
/**
 * There are six other native error constructors that inherit from the base
 * Error constructor, these are:
 *
 * EvalError
 * SyntaxError
 * RangeError
 * ReferenceError
 * TypeError
 * URIError
 *
 * Like any object, an error object can have its instance verified:
 * - $ node -p "var e = new SyntaxError(); e instanceof SyntaxError" - true.
 * 
 * Native errors objects also have a name property which contains the name of 
 * the error that created it:
 * $ node -e "var e = new TypeError(); console.log("Error name:", e.name)" - TypeError.
 * 
 * these error constructors that are likely to be thrown in library or application code, 
 * - RangeError and TypeError.

 */
//-------------_CUSTOM ERRORS_----------------------//
/**
 * There are different ways to communicate various error cases but we will explore two:
 * subclassing native error constructors and use a code property.
 * These aren't mutually exclusive.
 */
function doTask1(amount) {
  if (typeof amount !== "number")
    throw new TypeError("amount must be a number");
  if (amount <= 0) throw new RangeError("amount must be greater than zero");
  if (amount % 2) {
    const err = Error("amount must be even");
    err.code = "ERR_MUST_BE_EVEN";
    throw err;
  }
  return amount / 2;
}

doTask1(4);
/**
 * O/P
 * saurabhbharti@Sb-m-neo nodejs_certification % node errorhandler.js
/Users/saurabhbharti/Documents/nodejs_certification/errorhandler.js:56
    throw err;
    ^

Error: amount must be even
    at doTask1 (/Users/saurabhbharti/Documents/nodejs_certification/errorhandler.js:54:17)
    at Object.<anonymous> (/Users/saurabhbharti/Documents/nodejs_certification/errorhandler.js:61:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
    at Module.load (internal/modules/cjs/loader.js:928:32)
    at Function.Module._load (internal/modules/cjs/loader.js:769:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:72:12)
    at internal/main/run_main_module.js:17:47 {
  code: 'ERR_MUST_BE_EVEN'
}
 */
// using class and constructor
class OddError extends Error {
  constructor(varname = "") {
    super(varname + "must be even");
    this.code = "ERR_AMOUT_MUST_BE_EVEN";
  }
  get name() {
    return OddError;
  }
}
function doTask2(amount) {
  if (typeof amount !== "number")
    throw new TypeError("amount must be a number");
  if (amount <= 0) throw new RangeError("amount must be greater than zero");
  if (amount % 2) throw new OddError("amount");
  return amount / 2;
}

//doTask2(3);

//--------try/catch----------------//
try {
  const result = doTask2(4);
  console.log("RESULT:", result);
} catch (error) {
  console.log("Error caught:", error);
}
/**
 * use duck-typing to handle specific errors
 * donot use try/catch to handle errors for a callback function
 * it won't work because, try/catch statements would have been executed long before the callback is called.
 * use try/catch inside the callback statements to remove the above anti-pattern.
 */
//--------------------ASYNCHRONOUS ERROR HANDLING---------------------//
function doTaskAsync(amount) {
  return new Promise((resolve, reject) => {
    if (typeof amount !== "number") {
      reject(new TypeError("Amount should be a number"));
      return;
    }
    if (amount <= 0) {
      reject(new RangeError("Amount should be greater than 0"));
    }
    if (amount % 2) {
      reject(new OddError("Amount can not be odd"));
    }
    resolve(amount / 2);
  });
}
// doTaskAsync(3); -> this gives unhandled promose reject warning; we can handle this using then/catch

doTaskAsync(2)
  .then(() => {
    throw Error("SUCCESS RETHROw");
  })
  .catch((err) => {
    if (err.code === "ERR_AMOUNT_MUST_BE_NUMBER") {
      console.error("wrong type");
    } else if (err.code === "ERRO_AMOUNT_MUST_EXCEED_ZERO") {
      console.error("out of range");
    } else if (err.code === "ERR_MUST_BE_EVEN") {
      console.error("cannot be odd");
    } else {
      console.error("Unknown error", err);
    }
  });
/**
 * It's very important to realize that when the throw appears inside a promise handler,
 * that will not be an exception, that is it won't be an error that is synchronous.
 * Instead it will be a rejection, the then or catch handler will return a new promise that
 * rejects as a result of a throw within a handler.
 */

// Error Propagation
/**
 * Error propagation is where, instead of handling the error, we make it the responsibility of the caller instead.
 */
