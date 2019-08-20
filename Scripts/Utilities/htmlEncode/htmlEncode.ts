/**
 * Create a in-memory div, set it's inner text(which jQuery automatically encodes)
 * then grab the encoded contents back out.  The div never exists on the page.
 * @link https://stackoverflow.com/questions/14346414/how-do-you-do-html-encode-using-javascript
 * @param value
 */
function htmlEncode(value) {
  return $("<div/>")
    .text(value)
    .html();
}

export default htmlEncode;
