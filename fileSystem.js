/**
 * In node file -systems is managed by these modules
 * - fs // provides APIs to deal with the business of reading, writing,
 *      // file system meta-data and file system watching.
 * - path //for path manipulation and normalization across platforms
 */

/**
 * these 2 variables are present in every module.
 * __filename // holds the absoulte path of the currently executing file.
 * __dirname // holds the absolute path of the directory that the currently executing file is in.
 */
"use strict";
console.log("Path of CEF::", __filename); //-> /Users/saurabhbharti/Documents/nodejs_certification/fileSystem.js
console.log("path of CD::", __dirname); // -> /Users/saurabhbharti/Documents/nodejs_certification

/**
 * file path can be different in windows and POSIX[linux , macOs] OS.
 * e.g.
 * - linux -> /training/ch-13/example.js
 * - win -> C:\training\ch-13\example.js
 * backslash is the escape character in JavaScript strings.
 * so to represent in win path should be as -> C:\\training\\ch-13\\example.js
 *
 * this can be resolved by using join method of path module, which help in cross-env workings.
 */
const { join } = require("path");
console.log("fileSystems path::using join::", join(__dirname, "fileSystem.js"));

/**
 * path.join method can be passed as many arguments as desired. e.g. join('one','two','three')
 * path.isAbsolute will return true if a given path is absolute.
 */
// ********** other path builders ***************************** //
/**
 * path.relative -> Given two absolute paths, calculates the relative path between them.
 *
 * path.resolve -> Accepts multiple string arguments representing paths.
 *  - returns a string of the path that would result from navigating to each of the directories
 *  - in order using the command line cd command.
 *  - path.resolve('/foo', 'bar', 'baz')  // returns '/foo/bar/baz'
 *      - which is akin to executing cd /foo then cd bar then cd baz on the command line,
 *      - and then finding out what the current working directory is.
 *
 * path.normalize -> Resolves .. and . dot in paths and strips extra slashes.
 *  - path.normalize('/foo/../bar//baz') would return '/bar/baz'.
 *
 * path.format -> Builds a string from an object.
 */

// *************** Path deconstructors **************************** //
const { parse, basename, dirname, extname } = require("path");
console.log("filename parsed:", parse(__filename));
console.log("filename basename:", basename(__filename));
console.log("filename dirname:", dirname(__filename));
console.log("filename extname:", extname(__filename));

// fow win C:\\' will be appended for root & dir property

// ******************* Reading and Writing *********************** //
/**
 * fs module has both low and high level apis.
 * The lower level API's closely mirror POSIX system calls.
 * The higher level methods for reading and writing are provided in four abstraction types:
 *  - Synchronous
 *  - Callback based
 *  - Promise based
 *  - Stream based
 */

// Synchronous.
/**
 * All the names of synchronous methods in the fs module end with Sync.
 * e.g. readFileSync
 */
const { readFileSync } = require("fs");
const fileContents = readFileSync(__filename);
// synchronously read its own contents into a buffer and then print the buffer:
console.log("File contents sync buffer::", fileContents);

const fileContentDecoded = readFileSync(join(__dirname, "outFile"), {
  encoding: "utf-8",
});
console.log("File contents sync decoded:", fileContentDecoded);

// write
const { writeFileSync } = require("fs");
const contentsUpperCase = readFileSync(join(__dirname, "outFile"), {
  encoding: "utf-8",
});
writeFileSync(join(__dirname, "outFile"), contentsUpperCase.toUpperCase());
/**
 *  writeFileSync(join(__dirname, "out.txt"), contentsUpperCase.toUpperCase(), {
      flag: "a",
    });
    -> flag :"a" opens file in append mode
 */

// error handling can be achieved using try/catch for synchronous based apis.

// callback based
const { readFile } = require("fs");
readFile(join(__dirname, "outFile"), { encoding: "utf-8" }, (err, contents) => {
  if (err) {
    console.log("Error while reading file");
  } else {
    console.log("file read via callback::", contents);
  }
});

/**
 * However, the actual behavior of the I/O operation and the JavaScript engine is different.
 * In the readFileSync case execution is paused until the file has been read, whereas
 * in this example execution is free to continue while the read operation is performed.
 * Once the read operation is completed, then the callback function that we passed as
 * the third argument to readFile is called with the result. This allows for the
 * process to perform other tasks (accepting an HTTP request for instance).
 */

// promise based
/** 
    const { readFile, writeFile } = require("fs").promises;
    async function run() {
    const contents = await readFile(__filename, { encoding: "utf8" });
    const out = join(__dirname, "out.txt");
    await writeFile(out, contents.toUpperCase());
    }

    run().catch(console.error);
*/

// stream based
/**
 * The fs module has fs.createReadStream and fs.createWriteStream method for the same.
 * useful for large size files.
 */
const { pipeline } = require("stream");
const { createReadStream, createWriteStream } = require("fs");
const { Transform } = require("stream");
const createUppercaseStream = () => {
  return new Transform({
    transform(chunk, enc, next) {
      const uppercased = chunk.toString().toUpperCase();
      next(null, uppercased);
    },
  });
};

pipeline(
  createReadStream(__filename),
  createUppercaseStream(),
  createWriteStream(join(__dirname, "out.txt")),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("finished writing");
  }
);
