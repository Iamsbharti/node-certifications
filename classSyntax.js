class Wolf {
  constructor(name) {
    this.name = name;
  }
  howl() {
    console.log(this.name + ": awoooo");
  }
}
/**
 * The constructor method in each class is the equivalent to the function body of a
 * Constructor Function. So for instance
 * function Wolf (name) { this.name = name } is the same as
 * class Wolf { constructor (name) { this.name = name } }.
 */
/**
 * Any methods other than constructor that are defined in the class are added to the
 * prototype object of the function that the class syntax creates.
 */
class Dog extends Wolf {
  constructor(name) {
    super(name + "the DOG");
  }
  woof() {
    console.log(this.name + ": woooof");
  }
}
/**
 * The super keyword in the Dog class constructor method is a generic way to call
 * the parent class constructor while setting the this keyword to the current instance.
 */
const rufus = new Dog("Rufus");
rufus.howl();
rufus.woof();
