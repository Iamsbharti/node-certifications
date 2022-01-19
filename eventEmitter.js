const EventEmitter = require("events");

const emitter = new EventEmitter();

// more typical way to create a emiiter
class MyEmitter extends EventEmitter {
  constructor(opts = {}) {
    super(opts);
    this.name = opts.name;
  }
  destroy(err) {
    if (err) {
      this.emit("error", err);
      this.emit("close");
    }
  }
}
console.log("emitter -new::", emitter.getMaxListeners());
console.log("emitter -class::", new MyEmitter().getMaxListeners());

// listen events
emitter.on("event", (a, b) => console.log("Using on::", a, b));
// or
emitter.addListener("event", (a, b) => {
  console.log("using addListener::", a + "+" + b);
});
// emit events
emitter.emit("event", "some", "args");

// ordering is important, listeners are executed in the order of their declaration
emitter.on("first", (a) => console.log("FIRST EVENT::", a));
emitter.on("second", (b) => console.log("SECOND EVENT::", b));

emitter.emit("first", "1st event");
emitter.emit("second", "2nd event");

// ordering of event declaration  can be changed using prependListener
emitter.on("fourth", (d) => console.log("FOURTH EVENT::", d));
emitter.prependListener("third", (c) => console.log("THIRD EVENT::", c));

emitter.emit("third", "3rd event");
emitter.emit("fourth", "4th event");

// an event can be emitted more than once

emitter.on("more", () => console.log("Event multiple fired"));
emitter.emit("more");
emitter.emit("more");
emitter.emit("more");

// multiple event firing can be restricted using once , when this is used listeners are
// the "once" method will immediately remove its listener after it has been called:

emitter.once("once", () => console.log("Event once fired"));
emitter.emit("once");
emitter.emit("once");
emitter.emit("once");
