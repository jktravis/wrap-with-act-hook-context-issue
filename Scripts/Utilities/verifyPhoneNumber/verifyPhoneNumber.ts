/* global
Main,
$Ajax,
*/
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
/**
 * goes through all possible phone number formats available in CoBRA and checks
 * the input string (str) using phoneNumber.isValid()
 * @param str phone number string to be parsed and verified using libphonenumber-js
 */
function verifyPhoneNumber(str) {
  let code = "BE"; //"US", "BE", "NL", "FR", "DE", "JO" etc;
  Main && Main.currentLang.endsWith("US") && (code = "US");
  //Need to add an elseif switching code to jordan if on jordan server
  return verifyPhoneNumberWithCountryCode(code, str);
}

export function verifyPhoneNumberWithCountryCode(code, str) {
  //@ts-ignore
  if (!str.toLowerCase().match(/ext/i) && str.toLowerCase().match(/[a-z]/i)) {
    return false;
  }
  let phoneNumber = parsePhoneNumberFromString(str, code);
  if (phoneNumber && phoneNumber.isValid()) {
    return true;
  } else {
    if (str.charAt(0) !== "+") {
      return verifyPhoneNumberWithCountryCode(code, "+" + str);
    }
  }
  return false;
}

export default verifyPhoneNumber;
