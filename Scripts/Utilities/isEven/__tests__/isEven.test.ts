import isEven from "../isEven";

describe("isEven", () => {
  describe("when given an even number", () => {
    it("should return true", () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(4352)).toBe(true);
    });
  });

  describe("when given an odd number", () => {
    it("should return false", () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(4355)).toBe(false);
    });
  });
});
