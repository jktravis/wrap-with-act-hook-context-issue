import hasLength from "../hasLength";

describe("hasLength", () => {
  describe("when length property exists", () => {
    describe("and is greater than 0", () => {
      it("should return true", () => {
        expect(hasLength({ length: 1 })).toBe(true);
      });
    });

    describe("and is equal to or less than zero", () => {
      it("should return false", () => {
        expect(hasLength({ length: 0 })).toBe(false);
        expect(hasLength({ length: -1 })).toBe(false);
      });
    });
  });

  describe("when length property does _not_ exist", () => {
    it("should return false", () => {
      expect(hasLength({})).toBe(false);
    });
  });
});
