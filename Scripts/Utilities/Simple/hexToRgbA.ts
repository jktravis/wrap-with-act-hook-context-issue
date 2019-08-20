//https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
export function hexToRgbA(hex, alpha) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + "," + alpha + ")";
  }
  throw new Error("Bad Hex" + hex + " or bad alpha " + alpha);
}
export function rgbAToHex(rgbaVal) {
  if (rgbaVal !== undefined) {
    rgbaVal = rgbaVal.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return rgbaVal && rgbaVal.length === 4
      ? "#" +
          ("0" + parseInt(rgbaVal[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbaVal[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbaVal[3], 10).toString(16)).slice(-2)
      : "";
  }
}

export function rgbAToAlpha(rgbaVal) {
  if (rgbaVal !== undefined) {
    console.log(rgbaVal);
    const matchVal = rgbaVal.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (matchVal && matchVal.length === 4) {
      rgbaVal = rgbaVal
        .replace(matchVal[0], "")
        .replace(",", "")
        .replace(")", "");
      console.log(rgbaVal);
      return rgbaVal;
    }
  }
}
