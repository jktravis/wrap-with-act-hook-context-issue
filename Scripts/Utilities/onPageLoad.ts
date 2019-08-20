/*eslint-disable @typescript-eslint/no-angle-bracket-type-assertion*/
/* global
Main,
currentUrlPrefix,
stringEndsWithPolyfill,
stringStartsWithPolyfill,
*/
//import { currentUrlPrefix } from './Simple/currentUrlPrefix';
/**
 * Are you wanting these to run on every page? If so, I'd create something like a baseScript
 * entry point and import all those other functions.
 */
$(document).ajaxStart(() => {
  $("#imgHeader").attr("style", "animation: blink 2s ease-in infinite");
  $("#imgHeaderwide").attr("style", "animation: blink 2s ease-in infinite");
});

$(document).ajaxStop(() => {
  //$("#imgHeader").attr("style", "animation: ");
  $("#imgHeader").css("animation", "");
  $("#imgHeaderwide").css("animation", "");
});
// http://opserver2/gemini5/project/Web4434/10038/item/111598
//$(window).on("beforeunload", function () {
$(window).on("unload", () => {
  if (Main.serverBuildType !== "Belgium") {
    const urlToSend = currentUrlPrefix() + "Monitor/BootSelf";
    $.ajax({
      url: urlToSend,
      async: true,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      /**
       * What's the point of having the success/error blocks if you're not
       * doing anything with them?
       */
      success: (response: any) => {
        // do nothing
      },
      error: (xhr, status, error) => {
        // do nothing
      },
    });
  }
  return false;
});

/**
 * This should be moved to a module, but without being completely familiar with
 * jQuery plugins and overrides, and how the `this` context is set, I'm afraid
 * to do so.  //PJ: Me too.
 * @param degrees
 * @return {JQuery}
 */
(<any>jQuery.fn).rotate = function(degrees) {
  $(this).css({
    "-webkit-transform": "rotate(" + degrees + "deg)",
    "-moz-transform": "rotate(" + degrees + "deg)",
    "-ms-transform": "rotate(" + degrees + "deg)",
    transform: "rotate(" + degrees + "deg)",
  });
  return $(this);
};

stringEndsWithPolyfill();
stringStartsWithPolyfill();
