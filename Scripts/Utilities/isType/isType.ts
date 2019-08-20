import { equals, compose, type, curry } from "ramda";

/**
 * Take a variable of any type and returns a boolean if the native type
 * matches the string value.
 * @example
 *  isObject({}) // => true
 *  isObject(() => {}) // => false
 *
 * @param {string} compareString
 * @param {any} variable The variable to test.
 */
const isType = curry((compareString, variable) => {
  return compose(
    equals(compareString),
    type,
  )(variable);
});

const isObject = isType("Object");
const isNumber = isType("Number");
const isBoolean = isType("Boolean");
const isString = isType("String");

/**
 * NOTE: If you want to check if something is either null or undefined,
 * use `isNil` from Ramda directly.
 */
const isNull = isType("Null");
const isUndefined = isType("Undefined");

const isArray = isType("Array");
const isRegExp = isType("RegExp");
const isFunction = isType("Function");

export { isObject, isNumber, isBoolean, isString, isNull, isArray, isRegExp, isFunction, isUndefined };
