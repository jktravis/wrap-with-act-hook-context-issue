import htmlEncode from "../htmlEncode";

function textFormatter(text: string, maxlength: number) {
  if (text && text.length > maxlength) {
    return text.substring(0, maxlength) + " <span title='" + htmlEncode(text) + "'> ...</span>";
  } else {
    return text;
  }
}

export default textFormatter;
