/*eslint-disable
@typescript-eslint/no-namespace,
 */
//import 'jquery';
//http://weblogs.asp.net/dixin/archive/2010/05/22/anti-forgery-request-recipes-for-asp-net-mvc-and-ajax.aspx
//used to try to implement anti-forgery tokens on all of my ajax calls
//not sure if this is totally solid or not
/*export*/ namespace $Ajax {
  function postJsonWithVerificationToken(options) {
    const token = $('input[name=""__RequestVerificationToken""]').val();
    const headers: any = {};
    headers.__RequestVerificationToken = token;
    $.ajax({
      cache: false,
      dataType: "json",
      type: "POST",
      headers: headers,
      data: options.jsonData,
      contentType: "application/json; charset=utf-8",
      url: options.url,
      success: options.onSuccess,
      error: options.onError,
    });
  }
  function getAntiForgeryToken(tokenWindow, appPath) {
    // HtmlHelper.AntiForgeryToken() must be invoked to print the token.
    tokenWindow = tokenWindow && typeof tokenWindow === typeof window ? tokenWindow : window;
    appPath = appPath && typeof appPath === "string" ? "_" + appPath.toString() : "";
    // The name attribute is either __RequestVerificationToken,
    // or __RequestVerificationToken_{appPath}.
    const tokenName = "__RequestVerificationToken" + appPath;
    // Finds the <input type="hidden" name={tokenName} value="..." /> from the specified window.
    // var inputElements = tokenWindow.$("input[type='hidden'][name=' + tokenName + "']");
    const inputElements = tokenWindow.document.getElementsByTagName("input");
    for (let i = 0; i < inputElements.length; i++) {
      const inputElement = inputElements[i];
      if (inputElement.type === "hidden" && inputElement.name === tokenName) {
        return {
          name: tokenName,
          value: inputElement.value,
        };
      }
    }
  }
  function appendAntiForgeryToken(data, token) {
    // Converts data if not already a string.
    if (data && typeof data !== "string") {
      data = $.param(data);
    }
    // Gets token from current window by default.
    token = token ? token : getAntiForgeryToken(null, null); // $.getAntiForgeryToken(window).
    data = data ? data + "&" : "";
    // If token exists, appends {token.name}={token.value} to data.
    let rtnString = token ? data + encodeURIComponent(token.name) + "=" + encodeURIComponent(token.value) : data;
    rtnString = rtnString.replace(/&$/, ""); //remove trailing &, because that will confuse WebAPI fromURI parameters with nullable values
    return rtnString;
  }
  // Wraps $.post(url, data, callback, type) for most common scenarios.
  function postAntiForgery(url, data, callback, type) {
    return $.post(url, appendAntiForgeryToken(data, null), callback, type);
  }
  // Wraps $.ajax(settings).
  export function ajaxAntiForgery(settings) {
    // Supports more options than $.ajax():
    // settings.token, settings.tokenWindow, settings.appPath.
    const token = settings.token ? settings.token : getAntiForgeryToken(settings.tokenWindow, settings.appPath);
    settings.data = appendAntiForgeryToken(settings.data, token);
    return $.ajax(settings);
  }
}
