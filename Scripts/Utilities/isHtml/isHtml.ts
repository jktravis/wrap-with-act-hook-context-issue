/**
 * Takes a string and determines if it is HTML
 * @link {https://stackoverflow.com/a/15458968/168005}
 * @param {string} str
 */
function isHTML(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
}

export default isHTML;
