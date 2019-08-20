import isHtml from "../isHtml";

describe("isHtml", () => {
  it("should return true if string is html", () => {
    expect(isHtml("<div>foo</div>")).toBe(true);
  });

  it("should return false if string is not html", () => {
    expect(isHtml(1)).toBe(false);
    expect(isHtml("divfoo")).toBe(false);
    expect(isHtml("true")).toBe(false);
    expect(isHtml(undefined)).toBe(false);
    expect(isHtml("")).toBe(false);
  });
});
