"use strict";
const { EventEmitter } = require("events");

process.nextTick(console.log, "passed!");

const ee = new EventEmitter();

ee.on("error", (err) => console.log("MESSAGE::", err.message));
ee.emit("error", Error("timeout"));

/**
 * Without removing any of the existing code, and without using a
 * ​try/catch​ block add somecode which stops the process from crashing.
 * When implemented correctly the process shouldoutput ​passed!​.LFW211
 */
