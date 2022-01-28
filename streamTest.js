/**
 * Streams facilitate high volume data processing without requiring exorbitant
 * compute resources.
 * As an abstraction, streams also provide an ergonomic benefit, supporting the
 * decoupling of application logic around real time data using a functional
 * programming paradigm.
 */
/**
 * The Node core stream module exposes six constructors for creating streams:
    - Stream
    - Readable
    - Writable
    - Duplex
    - Transform
    - PassThrough
 */

/**
 * The Stream constructor is the default export of the stream module and inherits
 * from the EventEmitter constructor from the events module.
 * The Stream constructor is rarely used directly, but is inherited from by
 * the other constructors.
 * Stream constructor only implements "pipe" method.
 * node -p "stream + ''" 
 *  function Stream(opts) {
        EE.call(this, opts);
    }
 * node -p "stream.prototype"
    EventEmitter { pipe: [Function (anonymous)] }
 */

/**
 * Main events emmitted by various Stream implementation are:
 * - data [Readable Stream]
 * - end  [Readable Stream]
 * - finish [Writable Stream]
 * - close [common, emitted when stream is destroyed which happen if an underlying
 *          resourse is unexpectedly closed]
 * - error [common, emitted when stream encounters a error]
 */

//--- Stream Modes -------------- //
/**
 * Two stream modes
 * - binary
 * - object
 * these modes can be manipulated by objectMode flag while Stream init.
 * by default objectMode is false which is for binary mode; and is used to read/write Buffer instances.
 * object mode stream can read/write js objects and primitives(string , number) except null.
 */

// ------ Readable Stream --------- //
/**
 * creates Redable Stream
 * used to read (e.g.)
 * - a file
 * - a incoming HTTP request
 * - user i/p from CMD
 *
 * inherits Stream which inherits Eventemitter , hence Readable stream is event.
 * which data is available stream emitts a "data" event.
 */
"use strict";
const fs = require("fs");
const { Stream } = require("stream");
const readableStream = fs.createReadStream(__filename);
readableStream.on("data", (data) => console.log("DATA READ::", data));
readableStream.on("end", () => console.log("FILE READ STREAM END"));

/**
 * readable stream emits "data" event for each chunk of data read
 * it has a default "highWaterMark" option of 16kb; one event can read up to 16kb of data.
 * to read 64kb of data , 4 "data" events will be emitted.
 * when no data "end" event is emitted.
 */

// Readable streams are usually connected to an I/O layer via a C-binding;
// but we can create a readable stream ourselves.
const { Readable } = require("stream");
const createReadStream = () => {
  const data = ["one", "two", "three", "four"];
  return new Readable({
    //option object [1]
    read() {
      //read method [2]
      if (data.length === 0) this.push(null);
      // passing null as an argument to indicate that this is the end-of-stream.
      else this.push(data.shift());
    },
  });
};
const customRedable = createReadStream();
customRedable.on("data", (data) => console.log("CUSTOM READABLE::", data));
customRedable.on("end", () => console.log("CUSTOM READABLE Stream END/?"));

/**
 * To create a readable stream, the Readable constructor is called with the "new" keyword and passed an
 * options object [1] with a "read" method [2].
 * The read function is called any time Node internals request more data from the readable stream.
 * The this keyword in the read method points to the readable stream instance.
 */
// "encoding" option can be set while stream init which will handle the decoding of buffer object automatically.
const createReadStreamDecoded = () => {
  const data = ["one", "two", "three", "four"];
  return new Readable({
    encoding: "utf8",
    read() {
      if (data.length === 0) this.push(null);
      else this.push(data.shift());
    },
  });
};
const customDecodedReader = createReadStreamDecoded();
customDecodedReader.on("data", (data) => {
  console.log("DECODED DATA READ::", data);
});
customDecodedReader.on("end", () =>
  console.log("DECODED DATA READ STREAM END///>???")
);

/**
 * default stream mode is objectMode: false, the string is pushed to the readable stream, converted to a
 * buffer and then decoded to a string using UTF8.
 */

// objectMode:true -> object type stream
const createObjectModeReadStream = () => {
  const data = ["one", "two", "three", "four"];
  // this time the string is being sent from the readable stream without converting to a buffer first.
  return new Readable({
    objectMode: true,
    read() {
      if (data.length === 0) this.push(null);
      else this.push(data.shift());
    },
  });
};
const objectModeReader = createObjectModeReadStream();
objectModeReader.on("data", (data) =>
  console.log("OBJECT MODE STREAM READER::", data)
);
objectModeReader.on("end", () =>
  console.log("OBJECT MODER READER END::://???")
);

// Readable.from utility method which creates streams from iterable data structures, like arrays
// Readable.from utility function sets objectMode to true by default.
const readableFrom = Readable.from(["one", "two", "three", "four"]);
readableFrom.on("data", (data) => {
  console.log("Readable.from Stream::", data);
});
readableFrom.on("end", () =>
  console.log("Readable.from Stream END:::????////")
);
