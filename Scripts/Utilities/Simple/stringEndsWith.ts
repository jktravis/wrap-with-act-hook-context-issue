/**
 * Polyfill for IE 11 endsWidth
 */
//export default
function stringEndsWithPolyfill() {
  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
      const subjectString = this.toString();
      if (
        typeof position !== "number" ||
        !isFinite(position) ||
        Math.floor(position) !== position ||
        position > subjectString.length
      ) {
        position = subjectString.length;
      }
      position -= searchString.length;
      const lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    };
  }
}

function stringStartsWithPolyfill() {
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
    };
  }
}