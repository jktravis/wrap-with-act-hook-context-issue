import createDataToggle from "../createDataToggle";

describe("createDataToggle", () => {
  it("should set the key's value from true to false", () => {
    const data = {
      isSomething: true,
      isSomethingElse: false,
    };

    expect(createDataToggle("isSomething")(data)).toEqual({
      isSomething: false,
      isSomethingElse: false,
    });
  });

  it("should not mutate the object, but instead return a new one", () => {
    const data = {
      isSomething: true,
      isSomethingElse: false,
    };

    expect(createDataToggle("isSomething")(data)).not.toBe(data);
  });
});
