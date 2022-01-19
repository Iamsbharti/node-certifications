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
// the "once" method will immediately remove its listener after it has bemittern called:

emitter.once("once", () => console.log("Event once fired"));
emitter.emit("once");
emitter.emit("once");
emitter.emit("once");

// Removing listeners
const listener1 = () => {
  console.log("Listener 1");
};
const listener2 = () => {
  console.log("Listener 2");
};

emitter.on("remove-test", listener1);
emitter.on("remove-test", listener2);

setInterval(() => {
  console.log("Emitting event--");
  emitter.emit("remove-test");
}, 200);
setTimeout(() => {
  console.log("removing listener 1");
  emitter.removeListener("remove-test", listener1);
}, 500);
setTimeout(() => {
  console.log("removing listener 2");
  emitter.removeListener("remove-test", listener2);
}, 1100);

// remove all listeners
const listener3 = () => {
  console.log("listener 1");
};
const listener4 = () => {
  console.log("listener 2");
};

emitter.on("my-event", listener3);
emitter.on("my-event", listener4);
emitter.on("another-event", () => {
  console.log("another event");
});

setInterval(() => {
  emitter.emit("my-event");
  emitter.emit("another-event");
}, 200);

setTimeout(() => {
  emitter.removeAllListeners("my-event");
}, 500);

setTimeout(() => {
  emitter.removeAllListeners();
}, 1100);
