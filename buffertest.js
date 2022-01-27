/**
 * Buffer constructor is global.
 * Buffer constructor internals were refactored on top of the Uint8Array typed array.
 * So a buffer object is both an instance of Buffer and an instance
 * (at the second degree) of Uint8Array.
 */

const buffer = Buffer.alloc(10);
console.log("is buffer instance:", buffer instanceof Buffer);
console.log("is Unit8Array instance:", buffer instanceof Uint8Array);

/**
 * Buffer.prototype.slice method overrides the Uint8Array.prototype.slice
 * method to provide a different behavior.
 * - Uint8Array slice method will take a copy of a buffer between two index points.
 * - Buffer slice method will return a buffer instance that references the binary data
 *   in the original buffer that slice was called on.
 */

//----ALLOCATING BUFFERS-------//
/**
 * Usually a constructor would be called with the new keyword,
 * however with Buffer this is deprecated and advised against.
 * Do not instantiate buffers using new.
 */
const buffer1 = Buffer.alloc(10);
console.log("Safe buffer - unallocated memory::", buffer1); //<Buffer 00 00 00 00 00 00 00 00 00 00>
/**
 * The above would allocate a buffer of 10 bytes.
 * By default the Buffer.alloc function produces a zero-filled buffer
 */

/**
 * Any time a buffer is created, it's allocated from unallocated memory.
 * Unallocated memory is only ever unlinked, it isn't wiped.
 * This means that unless the buffer is overwritten (e.g. zero-filled)
 * then an allocated buffer can contain fragments of previously deleted data.
 * This poses a security risk, but the method is available for advanced use cases
 * where performance advantages may be gained and security and the developer is
 * fully responsible for the security of the implementation.
 */

// Every time Buffer.allocUnsafe is used it will return a different
// buffer of garbage bytes:

const unsafeBuffer = Buffer.allocUnsafe(10);
console.log("unsafeBuffer::", unsafeBuffer); // <Buffer 00 20 00 00 00 00 00 00 00 00>

/**
 * One of the reasons that "new" Buffer is deprecated is because it used to have the
 * - Buffer.unsafeAlloc behavior and now has the Buffer.alloc behavior which means using
 *   new Buffer will have a different outcome on older Node versions.
 * - The other reason is that new Buffer also accepts strings.
 */

// --- Converting Strings to Buffers --- //

/**
 * A buffer can be created from a string by using Buffer.from:
 * When a string is passed to Buffer.from the characters in the string are converted
 * to byte values:
 */
const bufferString = Buffer.from("i will be a buffer string");
console.log("String Buffer::", bufferString); //<Buffer 69 20 77 69 6c 6c 20 62 65 20 61 20 62 75 66 66 65 72 20 73 74 72 69 6e 67>
/**
 * In order to convert a string to a binary representation,
 * an encoding must be assumed.
 * When the string is converted to a buffer however, it has a length of 4.
 * This is because in UTF8 encoding,
 * The UTF8 encoding may have up to four bytes per character,
 * so it isn't safe to assume that string length will always match the converted
 * buffer size.
 */
console.log("UTF ENCODING ::", Buffer.from("👀").length); // 4

// second argument of Buffer.from can be a encoding type
console.log("Encoding type:UTF16LE:", Buffer.from("q", "UTF16LE")); // prints <Buffer 71 00>

// The supported byte-to-text encodings are hex and base64.
// Supplying one of these encodings allows us to represent the data in a string,
// this can be useful for sending data across the wire in a safe format.

// ---- Converting Buffers to Strings ----- //
// To convert a buffer to a string, call the toString method on a Buffer instance:

console.log("Buffer to string::", bufferString.toString()); // prints

// we also concatenate buffer to an empty string.
// This has the same effect as calling the toString method:

// The toString method can also be passed an encoding as an argument:
console.log("Buffer to string::with base64::", bufferString.toString("base64"));

/**
 * The UTF8 encoding format has between 1 and 4 bytes to represent each character,
 * if for any reason one or more bytes is truncated from a character this will result
 * in encoding errors.
 * So in situations where we have multiple buffers that might split characters across
 * a byte boundary the Node core "string_decoder" module should be used.
 */
const { StringDecoder } = require("string_decoder");
const frag1 = Buffer.from("f09f", "hex");
const frag2 = Buffer.from("9180", "hex");
console.log(frag1.toString()); // prints �
console.log(frag2.toString()); // prints ��
const decoder = new StringDecoder();
console.log(decoder.write(frag1)); // prints nothing
console.log(decoder.write(frag2)); // prints 👀

/**
 * Calling decoder.write will output a character only when all of the
 * bytes representing that character have been written to the decoder
 */

// ----- JSON Serializing and Deserializing Buffers ----- //

/**
 * When JSON.stringify encounters any object it will attempt to call a toJSON
 * method on that object if it exists.
 *
 * Buffer instances have a toJSON method which returns a plain JavaScript object
 * in order to represent the buffer in a JSON-friendly way:
 */

console.log(
  "JSON representation of Buffer::",
  JSON.stringify(Buffer.from("👀").toJSON())
);
// prints {"type":"Buffer","data":[240,159,145,128]}

/**
 * So Buffer instances are represented in JSON by an object that has
 * - a type property with a string value of 'Buffer' and
 * - a data property with an array of numbers,representing the value of each byte in
 *   the buffer.
 */

/**
 * When deserializing, JSON.parse will only turn that JSON representation of the
 * buffer into a plain JavaScript object, to turn it into an object the data array
 * must be passed to Buffer.from:
 */
const bufferSerialization = Buffer.from("👀");
const json = JSON.stringify(bufferSerialization);
const parsed = JSON.parse(json);
console.log(parsed); // prints { type: 'Buffer', data: [ 240, 159, 145, 128 ] }
console.log(Buffer.from(parsed.data)); // prints <Buffer f0 9f 91 80>
