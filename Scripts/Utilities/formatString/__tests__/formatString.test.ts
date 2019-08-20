import formatString from "../formatString";

describe("formatString", () => {
  it("should replace the annotations with the values provided", () => {
    const replacements = ["Dog", "Fox"];
    const string = "The quick brown {0} jumps over the lazy {1}";

    expect(formatString(string, replacements)).toEqual(`The quick brown Dog jumps over the lazy Fox`);

    expect(formatString(string, replacements.reverse())).toEqual(`The quick brown Fox jumps over the lazy Dog`);
  });

  it("should handle no matches", () => {
    const replacements = ["Dog", "Fox"];
    const string = "The quick brown Dog jumps over the lazy Fox";

    expect(formatString(string, replacements)).toEqual(string);
  });

  it("should handle more matches than replacements", () => {
    const replacements = ["Dog", "Fox"];
    const string = "The quick brown {0} jumps {2} the lazy {1}";

    expect(formatString(string, replacements)).toEqual("The quick brown Dog jumps {2} the lazy Fox");
  });

  it("should handle more replacements than matches", () => {
    const replacements = ["Dog", "Fox"];
    const string = "The quick brown {0} jumps over the lazy Cat";

    expect(formatString(string, replacements)).toEqual("The quick brown Dog jumps over the lazy Cat");
  });

  it("should handle falsy replacements that are not undefined", () => {
    const replacements = [0, false, "", null];
    const string = "There are {0} {1} statements unless {3} is an empty string ({2})";

    expect(formatString(string, replacements)).toEqual(
      "There are 0 false statements unless null is an empty string ()",
    );
  });
});
