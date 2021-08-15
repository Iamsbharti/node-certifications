"use strict";
const sayHiTo = prefixer("Hello ");
const sayByeTo = prefixer("GoodBye ");
console.log(sayHiTo("Dave"));
console.log(sayHiTo("Annie"));
console.log(sayByeTo("Dave"));

/**
 * execise implement prefixer  function (implement closure)
 */
function prefixer(prefix) {
  return (user) => {
    return prefix + user;
  };
}
