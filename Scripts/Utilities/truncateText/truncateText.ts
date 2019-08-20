/**
 * Truncate the text at a particular limit, appending an ellipses.
 * @param text
 * @param limit
 */
function truncateText(text, limit) {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

export default truncateText;
