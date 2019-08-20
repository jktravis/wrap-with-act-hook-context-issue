/**
 * Block and show a loader UI for the given DOM node.
 * Implicit requirement for jQuery.BlockUI
 * @param {jQuery | HTMLElement} divToBlock a jQuery object
 * @param {string} message
 */
function blockIt(divToBlock, message = "Loading...") {
  if (!divToBlock) {
    return;
  }

  const config = {
    message: `<h5>${message}</h5>`,
    css: { border: "3px solid #a00", padding: 5 },
  };

  if (!(divToBlock instanceof jQuery)) {
    //@ts-ignore
    $(divToBlock).block(config);
  }
  divToBlock.block(config);
}

export default blockIt;
