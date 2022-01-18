/**
 * 
function f(n = 99) {
  if (n === 0) throw Error();
  debugger;
  f(n - 1);
}
f();
**/
const obj = {
  id: 2,
  fn: function () {
    console.log(this.id);
  },
};

const obj1 = { id: 5, fn: obj.fn };

obj.fn(); // 2
obj1.fn(); // 5
/**
 * this referes to the object on which function is called upon
 */
const obj2 = {
  id: 3,
  fn: function () {
    console.log(this.id);
  },
};

const t1 = { id: 56 };
const t2 = { id: 90 };

obj2.fn.call(t1); // 56
obj2.fn.call(t2); // 90
obj2.fn(); // 3
obj2.fn.call({ id: 89 }); // 89
/**
 * call method on function dynamically sets the this context
 */

// closure scope concept
function prefixer(value) {
  return (name) => {
    return value + name;
  };
}
const sayHiTo = prefixer("Hello ");
const sayByeTo = prefixer("Goodbye ");
console.log(sayHiTo("Dave")); // prints 'Hello Dave'
console.log(sayHiTo("Annie")); // prints 'Hello Annie'
console.log(sayByeTo("Dave")); // prints 'Goodbye Dave'
