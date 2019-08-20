/* global
Main,
$Ajax,
*/
import { verifyPhoneNumberWithCountryCode } from "../verifyPhoneNumber";

describe("verifyPhoneNumberWithCountryCode", () => {
  let numbers = [];
  beforeEach(() => {
    numbers = [];
  });

  it("BE should pass this list of Belgian phone numbers", () => {
    numbers = [
      "+32 2/506.47.11",
      "+32 11 79 22 17",
      "011 79.22.17",
      "+32 478/887-897",
      "0478/887-897",
      "+32 11 79 22 17",
      "+32 2 506 47 11",
      "+32 478 887 897",
      "053342345",
    ];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("BE", numbers[i])).toBe(true);
    }
  });

  it("BE should pass this list of phone numbers from other countries", () => {
    numbers = [
      "+49 4882 8394", //de
      "+33 1 24 32 34 47", //fr
      "+31 24 323 3467", //nl
      "+18507389582", //us
      "+1(253)-652-2345", //us
    ];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("BE", numbers[i])).toBe(true);
    }
  });

  it("BE should fail this list of phone numbers", () => {
    numbers = ["+0478/887-897", "844563", "5555555", "abc57dh53"];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("BE", numbers[i])).toBe(false);
    }
  });

  it("US should pass this list of American phone numbers", () => {
    numbers = ["+18507389582", "+1(253)-652-2345", "(253)-652-2345", "908-404-2020", "6153154951"];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("US", numbers[i])).toBe(true);
    }
  });

  it("US should pass this list of phone numbers from other countries", () => {
    numbers = [
      "+49 4882 8394", //de
      "+33 1 24 32 34 47", //fr
      "+31 24 323 3467", //nl
      "+32 11 79 22 17", //be
      "+32 2 506 47 11", //be
      "+32 478 887 897", //be
    ];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("US", numbers[i])).toBe(true);
    }
  });

  it("US should fail this list of phone numbers", () => {
    numbers = ["+0478/887-897", "011 79.22.17", "0478/887-897", "053342345", "5555555", "5551234674", "abc57dh53"];
    for (var i = 0; i < numbers.length; i++) {
      expect(verifyPhoneNumberWithCountryCode("US", numbers[i])).toBe(false);
    }
  });
});
