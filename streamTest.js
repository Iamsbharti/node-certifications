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

//------------------Writable Streams-----------------------------------//
/**
 * e.g.
 * writable stream can be used to write
 * - file
 * - a HTTP respose
 * - to a terminal
 * it is also a event, since inherited by Stream and in turn inherited by EventEmitter.
 */
const writable = fs.createWriteStream("./outFile");
writable.on("finish", () => console.log("FINISHED WRITING:///"));
writable.write("one\n");
writable.write("two\n");
writable.write("three\n");
writable.write("four\n");
writable.write("five\n");
writable.end("Nothing more to write");

/**
 * The write method can be called multiple times.
 * The end method will also write a final payload to the stream before ending it.
 * When the stream is ended, the finish event is emitted.
 * Writable stream converts them to Buffer instance and then write them to the out file.
 */

//contrived write stream example
const { Writable } = require("stream");
const createWriteStream = (data) => {
  return new Writable({
    //To create a writable stream, call the Writable constructor with the new keyword.
    //The options object of the Writable constructor can have a write function.
    write(chunk, encoding, next) {
      // The "chunk" is each piece of data written to the stream.
      // "encoding" is encoding.
      // next is callback which must be called to indicate that we are ready for the next piece of data.
      data.push(chunk);
      next();
      //The point of a next callback function is to allow for asynchronous operations within the write option
      //function, this is essential for performing asynchronous I / O.
    },
  });
};
/**
 * the default objectMode option is false, so each string written to our writable stream instance is
 * converted to a buffer before it becomes the chunk argument passed to the write option function.
 * This can be opted out of by setting the "decodeStrings" option to false:
 */
const data = [];
const writableStream = createWriteStream(data);
writableStream.on("finish", () =>
  console.log("Custom Write stream END:????////::", data)
);
writableStream.write("A\n");
writableStream.write("B\n");
writableStream.write("CD\n");
writableStream.write("SDD\n");
writableStream.end(() =>
  console.log("No data to write with custom writable stream")
);
/**
 * objectMode:false -> by default
 * This will only allow strings or Buffers to be written to the stream, trying to pass any other
 * JavaScript value will result in an error.
 * e.g. writableStream.write(1) // will throw a error -> 'ERR_INVALID_ARG_TYPE'
 * to allow this use -> objectMode:true
 */

// -----------------Readable-Writable Streams -------------------------------------//
/**
 * constructors that have both readable and writable interfaces:
    - Duplex
    - Transform
    - PassThrough
 */
/** ********** Duplex Stream **************
 * The Duplex stream constructor's prototype inherits from the Readable constructor but it also
 * mixes in functionality from the Writable constructor.
 * With a Duplex stream, both read and write methods are implemented but there doesn't have to
 * be a causal relationship between them.
 */

//a TCP network socket is a great example of a Duplex stream:
// ******** socket server ************** //
const net = require("net");
net
  .createServer((socket) => {
    //The net.createServer function accepts a listener function which is called every time a client connects to the server.
    //The listener function is passed a Duplex stream instance which we called socket.
    const interval = setInterval(() => {
      socket.write("beat::"); // writable
    }, 1000);
    socket.on("data", (data) => {
      socket.write(data.toString().toUpperCase());
    });
    socket.on("end", () => clearInterval(interval));
  })
  .listen(3000);
// ******** socket client ************** //
const socket = net.connect(3000);
//The net.connect method returns a Duplex stream which represents the TCP client socket.

socket.on("data", (data) => {
  console.log("got data:", data.toString());
});
socket.write("hello");
setTimeout(() => {
  socket.write("all done");
  setTimeout(() => {
    socket.end();
  }, 250);
}, 3250);

// Transform
/**
 * The Transform constructor inherits from the Duplex constructor.
 * Transform streams are duplex streams with an additional constraint applied to enforce a causal
 * relationship between the read and write interfaces.
 */
const { createGzip } = require("zlib");
const transform = createGzip();
transform.on("data", (data) => {
  console.log("got gzip data", data.toString("base64"));
});
transform.write("first");
setTimeout(() => {
  transform.end("second");
}, 500);
// As data is written to the transform stream instance, data events are emitted on the readable side
// of that data in compressed format.

/**
 * Instead of supplying read and write options functions, a transform option is passed to the Transform constructor:
 * The transform option function has the same signature as the write option function passed to Writable streams.
 * It accepts chunk, enc and the next function.
 * ^ In the transform option function the next function can be passed a second argument which should be the result
 *   of applying some kind of transform operation to the incoming chunk.
 */
const { Transform } = require("stream");
const { scrypt } = require("crypto");
const createTransformStream = () => {
  return new Transform({
    decodeStrings: false,
    encoding: "hex",
    transform(chunk, enc, next) {
      scrypt(chunk, "a-salt", 32, (err, key) => {
        if (err) {
          next(err);
          return;
        }
        next(null, key);
      });
    },
  });
};
const transformCrypto = createTransformStream();
transform.on("data", (data) => {
  console.log("got data:", data);
});
transformCrypto.write("A\n");
transformCrypto.write("B\n");
transformCrypto.write("C\n");
transformCrypto.end("nothing more to write");
/**
 * The PassThrough constructor inherits from the Transform constructor.
 * It's essentially a transform stream where no transform is applied.
 */

// Determining end-of-stream
/**
 * there are at least four ways for a stream to potentially become inoperative:
    - close event
    - error event
    - finish event
    - end event
 * when stream are closed , resources should be deallocated otherwise memory leaks can happen.
 */
// Instead of listening to all four events, the stream.finished utility function provides a simplified way to do this:
const { finished } = require("stream");
net
  .createServer((socket) => {
    const interval = setInterval(() => {
      socket.write("beat");
    }, 1000);
    socket.on("data", (data) => {
      socket.write(data.toString().toUpperCase());
    });
    //replaced the end event listener with a call to the finished utility function.
    finished(socket, (err) => {
      if (err) {
        console.error("there was a socket error", err);
      }
      clearInterval(interval);
    });
  })
  .listen(3000);
// Piping streams
/**
 * The pipe method exists on Readable streams (recall socket is a Duplex stream instance and that Duplex inherits
 *  from Readable), and is passed a Writable stream (or a stream with Writable capabilities).
 * Internally, the pipe method sets up a data listener on the readable stream and automatically writes
 * to the writable stream as data becomes available.
 */
