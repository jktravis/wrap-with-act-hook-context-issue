import * as R from "ramda";

/**
 * Replace text similarly to String.format in other languages.
 * @param {string} string The string to format. Expects to have `{0}` markers where text is to be replaced
 * @param {any[]} replacements The array of replacements The index of each item will be matched to the number
 * markers in the string
 * @returns {string}
 */
const formatString = R.curry((string, replacements) => {
  return string.replace(/{(\d+)}/g, (match, number) => {
    return R.prop(number, replacements) !== undefined ? replacements[number] : match;
  });
});

export default formatString;
