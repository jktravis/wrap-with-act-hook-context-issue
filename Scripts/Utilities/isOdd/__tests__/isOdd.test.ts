import isOdd from "../isOdd";

describe("isOdd", () => {
  describe("when given an even number", () => {
    it("should return false", () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(4)).toBe(false);
      expect(isOdd(4352)).toBe(false);
    });
  });

  describe("when given an odd number", () => {
    it("should return true", () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(4355)).toBe(true);
    });
  });
});
