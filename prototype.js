const wolf = {
  howl: function () {
    console.log(this.name + ": awoo");
  },
};

const dog = Object.create(wolf, {
  woof: {
    value: function () {
      console.log(this.name + ": woof");
    },
  },
});
const rufus = Object.create(dog, {
  name1: { value: "Rufus is a dog" },
});
rufus.howl();
rufus.woof();
console.log(Object.getOwnPropertyDescriptor(dog, "woof"));
console.log("rufus:", Object.getPrototypeOf(rufus) === dog);
console.log("dog", Object.getPrototypeOf(dog) === wolf);
console.log("wolf:", Object.getPrototypeOf(wolf));
