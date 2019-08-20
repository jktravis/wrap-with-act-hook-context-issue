import { isNull, isFunction, isBoolean, isArray, isNumber, isObject, isRegExp, isString, isUndefined } from "../isType";

const Foo = function() {};

describe("isType", () => {
  describe("isNull", () => {
    it("should return true when null", () => {
      expect(isNull(null)).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isNull({})).toBe(false);
      expect(isNull(1)).toBe(false);
      expect(isNull(false)).toBe(false);
      expect(isNull("s")).toBe(false);
      expect(isNull([])).toBe(false);
      expect(isNull(/[A-z]/)).toBe(false);
      expect(isNull(() => {})).toBe(false);
      expect(isNull(undefined)).toBe(false);
      expect(isNull(new Foo())).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should return true when any object", () => {
      expect(isObject({})).toBe(true);
      expect(isObject(new Foo())).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isObject(1)).toBe(false);
      expect(isObject(false)).toBe(false);
      expect(isObject("s")).toBe(false);
      expect(isObject([])).toBe(false);
      expect(isObject(/[A-z]/)).toBe(false);
      expect(isObject(() => {})).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(null)).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("should return true when any number", () => {
      expect(isNumber(1)).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isNumber(false)).toBe(false);
      expect(isNumber("s")).toBe(false);
      expect(isNumber([])).toBe(false);
      expect(isNumber(/[A-z]/)).toBe(false);
      expect(isNumber(() => {})).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber(new Foo())).toBe(false);
    });
  });

  describe("isBoolean", () => {
    it("should return true when any boolean", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isBoolean("s")).toBe(false);
      expect(isBoolean([])).toBe(false);
      expect(isBoolean(/[A-z]/)).toBe(false);
      expect(isBoolean(() => {})).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean({})).toBe(false);
      expect(isBoolean(new Foo())).toBe(false);
      expect(isBoolean(1)).toBe(false);
    });
  });

  describe("isString", () => {
    it("should return true when a string", () => {
      expect(isString("s")).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isString(false)).toBe(false);
      expect(isString([])).toBe(false);
      expect(isString(/[A-z]/)).toBe(false);
      expect(isString(() => {})).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString(new Foo())).toBe(false);
      expect(isString(1)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("should return true when an array", () => {
      expect(isArray([])).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isArray(false)).toBe(false);
      expect(isArray(/[A-z]/)).toBe(false);
      expect(isArray(() => {})).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(new Foo())).toBe(false);
      expect(isArray(1)).toBe(false);
      expect(isArray("s")).toBe(false);
    });
  });

  describe("isRegExp", () => {
    it("should return true when a regular expression", () => {
      expect(isRegExp(/[A-z]/)).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isRegExp([])).toBe(false);
      expect(isRegExp(false)).toBe(false);
      expect(isRegExp(() => {})).toBe(false);
      expect(isRegExp(undefined)).toBe(false);
      expect(isRegExp(null)).toBe(false);
      expect(isRegExp({})).toBe(false);
      expect(isRegExp(new Foo())).toBe(false);
      expect(isRegExp(1)).toBe(false);
      expect(isRegExp("s")).toBe(false);
    });
  });

  describe("isFunction", () => {
    it("should return true when a function", () => {
      expect(isFunction(() => {})).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isFunction(/[A-z]/)).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction(false)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction({})).toBe(false);
      expect(isFunction(new Foo())).toBe(false);
      expect(isFunction(1)).toBe(false);
      expect(isFunction("s")).toBe(false);
    });
  });

  describe("isUndefined", () => {
    it("should return true when undefined", () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it("should return false when anything else", () => {
      expect(isUndefined(() => {})).toBe(false);
      expect(isUndefined(/[A-z]/)).toBe(false);
      expect(isUndefined([])).toBe(false);
      expect(isUndefined(false)).toBe(false);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined({})).toBe(false);
      expect(isUndefined(new Foo())).toBe(false);
      expect(isUndefined(1)).toBe(false);
      expect(isUndefined("s")).toBe(false);
    });
  });
});
