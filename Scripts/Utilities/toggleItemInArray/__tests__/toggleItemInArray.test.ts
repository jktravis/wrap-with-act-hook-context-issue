import toggleItemInArray from "../toggleItemInArray";

describe("toggleItemInArray", () => {
  let data;
  beforeEach(() => {
    data = ["foo", "bar"];
  });

  it("should be curried", () => {
    expect(typeof toggleItemInArray("foo")).toEqual("function");
    expect(typeof toggleItemInArray("foo", [])).toEqual("object");
    expect(typeof toggleItemInArray("foo")([])).toEqual("object");
  });

  it("should not mutate the array", () => {
    expect(toggleItemInArray("foo", data)).not.toBe(data);
  });

  it("should add an item when it's missing", () => {
    expect(toggleItemInArray("baz", data)).toEqual([...data, "baz"]);
  });

  it("should remove an item when it exists", () => {
    expect(toggleItemInArray("foo", data)).toEqual(["bar"]);
  });

  it("should work with objects, too", () => {
    expect(toggleItemInArray({ name: "foo" }, [])).toEqual([{ name: "foo" }]);
    expect(toggleItemInArray({ name: "foo" }, [{ name: "foo" }])).toEqual([]);
  });
});
