/*eslint-disable
@typescript-eslint/camelcase,
@typescript-eslint/no-angle-bracket-type-assertion,
@typescript-eslint/no-namespace,
@typescript-eslint/no-triple-slash-reference,
 */
/* global
$Ajax,
currentUrlPrefix,
ga
*/
/// <reference path="../thinkgeo/openlayers-2.10.0.d.ts" />
/// <reference path="../Definitions/signalRHubs.d.ts" />

//import $ from 'jquery';
//import * as $Ajax from './Ajax';
//import 'bootstrap';
//import 'bootstrap-notify';
//import '@progress/kendo-ui/js/kendo.web';
//import '@progress/kendo-ui/js/kendo.aspnetmvc';
//import 'signalr';
//import 'jquery-validation';
//import { currentUrlPrefix } from './Simple/currentUrlPrefix';

interface ToolRoleObject extends kendo.data.ObservableObject {
  ToolRoleGUID: string;
}

/*export*/
namespace Main {
  //can't get moment to work.  this is a hack
  declare var moment: any;
  declare function openWindow(): void;

  /**
   * Consider returning cobraPush from an exported function instead of exporting a variable that may/may not be set
   * as a side-effect from another function.
   */
  export var cbraPush;

  /**
   * Consider taking/returning data and exporting that instead of relying on a side-effect. This kind of code makes it
   * really hard to test given there are a number of unknown dependencies or code that depends upon this code.
   */
  let alertitemRemoved;
  let lastSignalRUpdate: Date;

  export var currentProjectGUID: string;
  const isCurrentTabVisible = (() => {
    let stateKey,
      eventKey,
      keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange",
      };
    for (stateKey in keys) {
      if (stateKey in document) {
        eventKey = keys[stateKey];
        break;
      }
    }
    return (c: any) => {
      if (c) {
        document.addEventListener(eventKey, c);
      }
      return !document[stateKey];
    };
  })();
  export var currentLang: string;
  export var serverBuildType: string;
  export function UseMetric(): boolean {
    if (serverBuildType === "Belgium") {
      return true;
    }
    if (currentLang !== "en-US") {
      return true;
    }
    return false;
  }
  interface IGlobalPrompts {
    LoadingPrompt: string;
    CurrentPositionPrompt: string;
    ClickToChangePrompt: string;
    PasswordChanged: string;
    PasswordsDoNotMatch: string;
  }
  interface IInitParams extends IGlobalPrompts {
    ProjectGUID: string;
    GoogleAnalyticKey: string;
    GoogleHostName: string;
    IsLocal: boolean;
    CultureName: string;
    ServerBuild: string;
  }
  let globalPrompts: IGlobalPrompts;
  export function initPage(initParams: IInitParams) {
    if ($("#txtSelPrj") && $("#txtSelPrj").length > 0) {
      $("#txtSelPrj").val("");
    }
    $("#btnmainmenu").on("click", function() {
      $("#mainmenu").toggleClass("active");
    });
    currentProjectGUID = initParams.ProjectGUID;
    currentLang = initParams.CultureName;
    serverBuildType = initParams.ServerBuild;
    initGoogleAnalytics(initParams.GoogleAnalyticKey, initParams.GoogleHostName);
    globalPrompts = initParams;
    loadLangSwitch();
    qtipSection("#headerLine");
    qtipSection("#opperiodline");

    //********trying to point signalr to a different server
    //$.connection.hub.logging = true;
    //$.connection(signalRServer());
    //$.connection.hub.url = signalRServer();
    //var cnn:any = $.hubConnection(signalRServer());
    //var chat = cnn.createHubProxies();
    //*****************************************
    cbraPush = (<CobraHub>$.connection).cobraHub;

    cbraPush.client.sendBootMessage = showfriendlyBootMessage;
    if (currentProjectGUID.length > 0) {
      getCustomMenu();
      getCurrentPositionText();
      alertitemRemoved = false;
      // Main.cbraPush.client.alarmforwindowUpdated = refreshalertwindowGrid;
      cbraPush.client.projectheadingupdated = refreshprojectheading;
      cbraPush.client.tickerupdated = refreshtickerheading;
      cbraPush.client.statusupdated = refreshstatusheading;
      cbraPush.client.weatherupdated = refreshweatherheading;
      cbraPush.client.alarmforwindowUpdated = refreshalertwindowGrid;
      rebuildTicker();
      initAlertGrid();
    }
    $.connection.hub.error((err: SignalR.ConnectionError) => {
      Main.notifyMessage({ message: err.message }, { type: "danger" });
    });
    $.connection.hub.connectionSlow(() => {
      updateConnectionState(false);
    });
    $.connection.hub.disconnected(() => {
      updateConnectionState(false);
      setTimeout(() => {
        $.connection.hub.start();
      }, 5000); // restart connection after 5 seconds.
    });

    function updateConnectionState(isConnected: boolean) {
      //var icon = $("#divLogo");
      const connLost = $("#connectionLost");
      if (connLost !== null && connLost.length > 0) {
        if (isConnected) {
          $("#connectionEstablished").attr("style", "display: normal");
          connLost.attr("style", "display: none");
          //icon.attr("style", "border: 1px solid green");
        } else {
          $("#connectionEstablished").attr("style", "display: none");
          connLost.attr("style", "display: normal;color:yellow");
          //icon.attr("style", "border: 2px solid red");
          signalLostQtip(connLost);
          if ($.connection.hub.lastError) {
            /*eslint-disable-next-line no-console*/
            console.log("Disconnected. Reason: " + $.connection.hub.lastError.message);
          }
        }
      }
    }
    $.connection.hub.reconnected(() => {
      updateConnectionState(true);
      // refreshgrid();
    });
    $.connection.hub.stateChanged((s: SignalR.StateChanged) => {
      switch (s.newState) {
        case 0: //Connecting
          updateConnectionState(false);
          break;
        case 1: //Connected
          updateConnectionState(true);
          break;
        case 2: //Reconnecting
          updateConnectionState(false);
          break;
        case 3: //Disconnected
          //updateConnectionState(false);
          //this is already handled above.  weird to call it twice.
          break;
        default:
          updateConnectionState(false);
      }
    });
    //if (isLocal === 'False') {
    //    initServiceWorker();
    //}
    checkBrowser();
    convertToLocalTimes();
    isCurrentTabVisible(visibilityHasChanged);
  }

  export function ConvertCodeStringToChars(text) {
    let encodedTitle = "";
    if (text.match(/(&#.*;)/g)) {
      const items = text.split(";");
      for (var i = 0; i < items.length; i++) {
        var indexStart = items[i].indexOf("&#");
        if (indexStart === -1) {
          encodedTitle += items[i];
        } else {
          items[i] = items[i].replace("&#", "");
          encodedTitle += items[i].substring(0, indexStart);
          encodedTitle += String.fromCharCode(parseInt(items[i].substring(indexStart)));
        }
      }
    } else {
      encodedTitle = htmlEncode(text);
    }

    return encodedTitle;
  }

  export function LoadHeader(productName, title, font, imageurl, hiddenTitle: boolean) {
    if (title.length > 0) {
      let encodedTitle = ConvertCodeStringToChars(title);
      if (!hiddenTitle && (font.length > 0 || imageurl.length > 0)) {
        let headerText = "<div class='d-flex justify-content-start align-items-center'>";
        if (font.length > 0) {
          headerText = headerText + '<span class="p-2"><i class="' + font + '"></i></span>';
        } else if (imageurl.length > 0) {
          //i don't do this because if the image doesn't exist it crashes.  &404?
          //headerText = headerText + '<span class="p-2"><img alt="' + title + '" src="' + imageurl + '&w=25" /></span>';
        }
        headerText = headerText + encodedTitle + "</div>";
        $("#bodyTitle").html(headerText);
      }
      document.title = productName + " - " + encodedTitle; //some duplicated effort here with ViewBag.Title
    }
  }

  function checkBrowser() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      //Main.notifyMessage({ message: "Safari de
      // tected.  This browser is not officially supported." }, { type: 'danger' });
    }
  }
  function signalLostQtip(icon) {
    let popOptions = {
      content:
        '<span class="text-danger fa-stack"><i class="fas fa-slash fa-stack-1x"></i><i class="fas fa-plug fa-stack-1x"></i></span>',
      //delay: { "show": 100, "hide": 500 },
      placement: "auto",
      html: true,
      title: icon.attr("title"),
    };
    icon.popover(popOptions);
  }
  export function reloadPage() {
    location.reload(true);
  }
  function initGoogleAnalytics(googleKey: string, googHostName: string) {
    if (googleKey.length > 0) {
      //from google itself.  doesn't work in typescript
      //(function (i, s, o, g, r, a, m) {
      //    i.GoogleAnalyticsObject = r;
      //    i[r] = i[r] || function () {
      //        (i[r].q = i[r].q || []).push(arguments);
      //    }, i[r].l = 1 * new Date();
      //    a = s.createElement(o),
      //        m = s.getElementsByTagName(o)[0];
      //    a.async = 1;
      //    a.src = g;
      //    m.parentNode.insertBefore(a, m);
      //})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      //ga('create', googleKey, googHostName);
      //ga('send', 'pageview');

      //https://gist.github.com/Thorium/40b733716b92b8d711fe
      let gaNewElem: any = {};
      let gaElems: any = {};
      let currdate: any = new Date();
      ((i: any, s, o, g, r, a, m) => {
        i.GoogleAnalyticsObject = r;
        (i[r] =
          i[r] ||
          function() {
            (i[r].q = i[r].q || []).push(arguments);
          }),
          (i[r].l = 1 * currdate);
        (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga", gaNewElem, gaElems);
      ga("create", googleKey, googHostName);
      ga("send", "pageview");
    }
  }
  export function initServiceWorker(swjsFile) {
    const prefix = currentUrlPrefix();
    if ("serviceWorker" in navigator) {
      addEventListener(
        "load",
        () => {
          navigator.serviceWorker.register(prefix + "build/js/cache-digest-immutable.js");
        },
        true,
      );
      navigator.serviceWorker.register(swjsFile).then(() => {
        /*eslint-disable-next-line no-console*/
        console.log("Service Worker Registered");
      });
    }
  }

  export function initKendoCulture(cultureToInit: string) {
    kendo.culture(cultureToInit);
    $.validator.addMethod("date", function(value, element) {
      return this.optional(element) || kendo.parseDate(value);
    });
  }

  export function checkConsent() {
    const prefix = currentUrlPrefix();
    if (prefix !== null && prefix !== undefined) {
      const newurl = prefix + "Account/SeeIfConsentBannerIsRequired";
      $.ajax({
        url: newurl,
        type: "GET",
        cache: true,
        success: (checkResponse: any) => {
          if (checkResponse && checkResponse.BannerExists) {
            if (checkResponse.Banner && checkResponse.Banner.length > 0) {
              $("#divConsent").html(checkResponse.Banner);
              $("#consentModal").modal({ keyboard: false, backdrop: "static" });
              document.getElementById("btnConsentOk").focus();
            }
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  function loadLangSwitch() {
    const prefix = currentUrlPrefix();
    if (prefix !== null && prefix !== undefined) {
      const newurl = prefix + "Home/GeLanguageSwitcher";
      $.ajax({
        url: newurl,
        cache: true,
        type: "GET",
        success: (response: any) => {
          if (response && response.length > 0) {
            $("#divSwitchLang").html(response);
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  export function wasLastUpdateTooRecent() {
    const refreshTimeMaxInSeconds = 5;
    const curTime = moment();
    //console.log(curTime);
    if (lastSignalRUpdate !== null && lastSignalRUpdate !== undefined) {
      const diffValue = curTime.diff(lastSignalRUpdate, "seconds");
      //console.log(diffValue);
      if (diffValue < refreshTimeMaxInSeconds) {
        return true;
      }
    }
    lastSignalRUpdate = curTime;
    return false;
  }

  export function confirmMessage(message, resultFunc: (result) => void) {
    if (message && message.length > 0) {
      Swal.fire({
        //title: 'Are you sure?', //localize
        text: message,
        type: "warning",
        showCancelButton: true,
        //confirmButtonText: 'Ok'  //localize
      }).then(result => {
        if (resultFunc) {
          resultFunc(result.value);
        }
      });
    }
  }

  export function notifyMessage(messageObj, typeObj) {
    //$.notify({ message: "You must enter a dashboard name to save" }, { type: 'danger' });
    notifyMessageSimple(messageObj.message, typeObj.type);
  }

  let toast;
  declare var Swal;

  function notifyMessageSimple(message, type) {
    if (message && message.length > 0) {
      if (!type || type === "danger") {
        //accomodating old ways of doing this
        type = "error";
      }
      if (!toast) {
        toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      toast.fire({
        type: type,
        title: message,
      });
    }
  }

  export function qtipSection(sectionName: string) {
    if (sectionName.length > 0) {
      if (!sectionName.startsWith("#")) {
        sectionName = "#" + sectionName;
      }
      if ($(sectionName).length > 0) {
        //$(sectionName + "[data-url]").each(function () {
        $("[data-url]").each(function() {
          qTipItem(this);
        });
      }
    }
  }
  function qTipItem(obj) {
    const url = $(obj).data("url");
    const loaded = $(obj).data("loaded");

    //bootstrap https://getbootstrap.com/docs/4.1/components/popovers/
    let popOptions = {
      content: function() {
        const div_id = "tmp-id-" + $.now();
        return details_in_popup(url, div_id, obj);
      },
      delay: { hide: 900, show: 500 },
      placement: "right",
      animation: true,
      title: "",
      html: true,
      trigger: "hover focus",
      container: "body",
      boundary: "viewport",
    };
    (<any>$(obj)).popover(popOptions);

    ////kendo https://demos.telerik.com/kendo-ui/tooltip/index
    ////problem with kendo is that it requires a close button, which whatever
    ////but i'll also need to make a parent layout for all of these tooltips, or the background is too black
    ////plus i don't know a good way to make the width/height adaptive.  maybe in the requestEnd ?
    //$(obj).kendoTooltip({
    //  autoHide: false,
    //  //filter: "a",
    //  content: {
    //    url: url
    //  },
    //  width: 400,
    //  height: 280,
    //  position: "top",
    //  //requestStart: function (e) {
    //  //  e.options.url = kendo.format(urlFormat, e.target.data("id"));
    //  //}
    //});
  }
  function details_in_popup(link, div_id, parentObj) {
    $.ajax({
      url: link,
      type: "GET",
      success: function(response) {
        if (response !== null) {
          $(parentObj).attr("data-loaded", "true"); //so the ajax call only happens once
          $("#" + div_id).html(response);
        }
      },
    });
    if (globalPrompts && globalPrompts.LoadingPrompt) {
      return '<div id="' + div_id + '">' + globalPrompts.LoadingPrompt + "</div>";
    } else {
      return '<div id="' + div_id + '">...</div>';
    }
  }
  function qtipAll() {
    $("[data-url]").each(function() {
      qTipItem(this);
    });
  }
  export function notifySomethingHasChanged() {
    if (isCurrentTabVisible(null) !== true) {
      const str = document.title;
      if (str.substr(-1) !== "!") {
        document.title = "!" + str + "!";
      }
    }

    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#ffcc00");
    setTimeout(function() {
      document.querySelector('meta[name="theme-color"]').setAttribute("content", "#c53211");
    }, 10000);
  }
  function visibilityHasChanged() {
    const str = document.title;
    if (str.substr(-1) === "!") {
      document.title = str.replace(/!/g, "");
    }
  }

  export function redirectLangSite(currentSiteName, newSiteName) {
    const currentURL = window.location.pathname.toLowerCase() + window.location.search.toLowerCase();
    const urlToPost = currentURL.replace(currentSiteName, newSiteName);
    window.location.href = urlToPost;
  }
  export function selectedprojectchanged(currentPrjGUID: string, newselProject: string) {
    const currentURL = window.location.pathname;
    const urlToPost = currentURL.replace(currentPrjGUID, newselProject);
    window.location.href = urlToPost;
  }
  // ************User preferences window
  export function openprefwindow(theUrl: string) {
    const window = $("#prefWindow").data("kendoWindow");
    window.refresh({
      url: theUrl,
    });
    window.open().center();
  }
  function closeprefwindow() {
    const window = $("#prefWindow").data("kendoWindow");
    window.close();
  }
  export function saveuserprefs(theurl: string) {
    const kendoStyle = $("#KendoStyle")
      .data("kendoDropDownList")
      .value();
    const defaultpage = $("#DefaultPage")
      .data("kendoDropDownList")
      .value();
    let soundOnAlert = false;
    if ($("#SoundOnAlert").length > 0) {
      if ($("#SoundOnAlert").is(":checked")) {
        soundOnAlert = true;
      }
    }
    let useNewMap = false;
    if ($("#UseNewMap").length > 0) {
      if ($("#UseNewMap").is(":checked")) {
        useNewMap = true;
      }
    }
    const sendAlertAsSMS = $("#SendAlertAsSMS")
      .data("kendoDropDownList")
      .value();
    const sendAlertAsEmail = $("#SendAlertAsEmail")
      .data("kendoDropDownList")
      .value();
    let sendAlertAsVoice = "false";
    if ($("#SendAlertAsVoice").length > 0) {
      sendAlertAsVoice = $("#SendAlertAsVoice")
        .data("kendoDropDownList")
        .value();
    }
    const baseMapPreference = $("#BaseMapValue")
      .data("kendoDropDownList")
      .value();
    $Ajax.ajaxAntiForgery({
      url: theurl,
      type: "POST",
      data: {
        KendoStyle: kendoStyle,
        SoundOnAlert: soundOnAlert,
        UseNewMap: useNewMap,
        SendAlertAsSMS: sendAlertAsSMS,
        SendAlertAsEmail: sendAlertAsEmail,
        SendAlertAsVoice: sendAlertAsVoice,
        DefaultPage: defaultpage,
        PreferredBaseMap: baseMapPreference,
      },
      success: (response: any) => {
        if (response !== null) {
          if (response.success === false) {
            Main.notifyMessage(response.Message, "danger");
          }
        }
        closeprefwindow();
        // window.location.reload(true);
        // location.reload(true);
        // history.go(0);
        // window.location.href = window.location.href;
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
  // ************User preferences window

  // ************User preferences window
  export function openchngpass(theUrl: string) {
    const window = $("#chngPassWindow").data("kendoWindow");
    window.refresh({
      url: theUrl,
    });
    window.open().center();
  }
  function closechngpass() {
    const window = $("#chngPassWindow").data("kendoWindow");
    window.close();
  }
  export function changepassword(theurl: string) {
    const passwordObj = {
      OldPassword: $("#OldPassword").val(),
      NewPassword: $("#NewPassword").val(),
      ConfirmPassword: $("#ConfirmPassword").val(),
    };
    if (passwordObj.NewPassword.length > 0) {
      if (passwordObj.NewPassword !== passwordObj.ConfirmPassword) {
        $("#txtValSummary").text(globalPrompts.PasswordsDoNotMatch);
        return;
      }
      blockit($("#chngPassDiv"));
      $Ajax.ajaxAntiForgery({
        url: theurl,
        type: "POST",
        data: {
          model: passwordObj,
        },
        success: (response: any) => {
          unblockit($("#chngPassDiv"));
          if (response !== null) {
            if (response.success === false) {
              $("#txtValSummary").text(response.Message);
              return;
            }
          }
          closechngpass();
          Main.notifyMessage({ message: globalPrompts.PasswordChanged }, { type: "info" });
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  // ************User preferences window

  /**
   * @deprecated Use standalone function when webpacking
   * @param xhr
   * @param status
   * @param error
   */
  export function handlejqerr(xhr, status, error) {
    const verr = xhr.status + "\r\n" + status + "\r\n" + error;
    /*eslint-disable-next-line no-console*/
    console.log(verr);
    if (xhr.status === 403) {
      Main.notifyMessage(
        {
          message:
            "You do not have permission to perform this action, please check your permission level, or refresh your browser.",
        },
        { type: "danger" },
      );
    }
  }
  export function handleValErr(errorDiv, errorResponse) {
    if (typeof errorResponse.ValidationResults !== "undefined") {
      let errMessage = "Validation Errors:\n";
      $.each(errorResponse.ValidationResults, (index, e) => {
        errMessage += e.ErrorMessage + "\n";
        const obj = e.MemberNames[0];
        if ($("#" + obj).length > 0) {
          $("#" + obj).addClass("input-validation-error");
        }
      });
      errorDiv.text(errMessage);
    } else if (errorResponse.Messages !== undefined && errorResponse.Messages.length > 0) {
      $.each(errorResponse.Messages, (index, e) => {
        Main.notifyMessage({ message: e }, { type: "danger" });
      });
    } else {
      Main.notifyMessage({ message: errorResponse.Message }, { type: "danger" });
    }
  }

  export function silentHandleValErr(errorResponse) {
    var errorDiv = $("div.validation-summary-valid")[0];
    if (typeof errorDiv === "undefined") {
      errorDiv = $("div.validation-summary-errors")[0];
    }
    if (errorResponse.Messages.length <= 0 && errorDiv) {
      while (errorDiv.children.length > 0 && errorDiv.children[1].firstChild) {
        errorDiv.children[1].removeChild(errorDiv.children[1].firstChild);
      }
      errorDiv.classList.add("validation-summary-valid");
      errorDiv.classList.remove("validation-summary-errors");
    }
    if (errorResponse.Messages.length > 0 && errorDiv) {
      while (errorDiv.children.length > 0 && errorDiv.children[1].firstChild) {
        errorDiv.children[1].removeChild(errorDiv.children[1].firstChild);
      }
      let errMessage = "Validation Errors:\n";
      errorResponse.Messages.forEach(e => {
        var lItem = document.createElement("li");
        var text = document.createTextNode(e);
        lItem.appendChild(text);
        errorDiv.children[1].appendChild(lItem);
      });
      errorDiv.classList.add("validation-summary-errors");
      errorDiv.classList.remove("validation-summary-valid");
    }
  }

  /**
   * @deprecated Use standalone function if webpacking
   * @param datetouse
   */
  export function dateFormatter(datetouse) {
    const dateToCheck = new Date(datetouse).setHours(0, 0, 0, 0);
    // Get today's date
    const todaysDate = new Date().setHours(0, 0, 0, 0);
    // call setHours to take the time out of the comparison
    if (dateToCheck === todaysDate) {
      // Date equals today's date, just show time
      return kendo.toString(datetouse, "T");
    } else {
      return kendo.toString(datetouse, "G");
    }
  }
  export function updateKendoDateTimePickerToLocal(tempStorageDateID, kendoID) {
    const dateStorage = $("#" + tempStorageDateID);
    const value = dateStorage.val();
    if (value) {
      var momentUTC = moment.unix(value);
      $("#" + kendoID)
        .data("kendoDateTimePicker")
        .value(momentUTC.local().toDate());
    }
  }
  export function convertToLocalTimes() {
    $("time[data-format]").each(function() {
      const el = $(this);
      const dt = moment.unix(+el.attr("datetime"));
      el.text(dt.format(el.data("format")));
    });
  }
  function rebuildTicker() {
    if ($("#divTicker") && $("#divTicker").length > 0) {
      convertToLocalTimes();
      $("#divTickerInfo").attr("style", "display: normal");
    }
  }
  // **************************Incident stuff
  function refreshtickerheading(LogEntryGUID: string, projectGUID: string) {
    if (projectGUID === currentProjectGUID) {
      const newurl = currentUrlPrefix() + "Tools/Ticker/ViewJustTickerNoCache/" + currentProjectGUID;
      // "@Url.Action("ViewJustTicker", "Ticker", new { area = "Tools", id = ViewContext.RouteData.Values["id"].ToString() }, null)";
      $.ajax({
        url: newurl,
        type: "GET",
        success: (response: any) => {
          if (response !== null) {
            $("#divTickerInfo").html(response);
            rebuildTicker();
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  export function selectedorgchanged(currentOrg: string, newOrg: string) {
    const currentURL = window.location.pathname;
    let urlToPost = "";
    if (currentURL.toLowerCase().indexOf("currentorganization") >= 0) {
      urlToPost = currentURL.replace(currentOrg, newOrg);
    } else if (currentURL.toLowerCase().indexOf("?") >= 0) {
      urlToPost = currentURL + "&CurrentOrganization=" + newOrg;
    } else {
      urlToPost = currentURL + "?CurrentOrganization=" + newOrg;
    }
    window.location.href = urlToPost;
  }
  //function populateAdminHeading(orgName: string) {
  //    if (orgName !== undefined && orgName.length > 0) {// do nothing
  //    } else {
  //        orgName = "";
  //    }
  //    var newurl = currentUrlPrefix() + "Admin/AdminHome/GetAdminHeading?CurrentOrganization=" + orgName;
  //    $.ajax({
  //        url: newurl,
  //        type: "GET",
  //        success: (response: any) => {
  //            if (response !== null) {
  //                if (response.success !== false) {
  //                    $("#projectheading").html(response);
  //                }
  //            }
  //        },
  //        error: (xhr, status, error) =>{
  //            Main.handlejqerr(xhr, status, error);
  //        }
  //    });
  //}
  export function refreshIncWeatherFromSource() {
    const newurl = currentUrlPrefix() + "Tools/Weather/RefreshWeatherFromSource/" + currentProjectGUID;
    $Ajax.ajaxAntiForgery({
      url: newurl,
      type: "POST",
      success: (response: any) => {
        if (response !== null) {
          // do nothing
        }
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
  function refreshweatherheading(LogEntryGUID: string, projectGUID: string) {
    if (projectGUID === currentProjectGUID) {
      qtipSection("headingbuttons");
    }
  }
  function refreshstatusheading(LogEntryGUID: string, projectGUID: string) {
    if (projectGUID === currentProjectGUID) {
      const newurl = currentUrlPrefix() + "Tools/Status/ViewJustStatusNoCache/" + currentProjectGUID;
      // "@Url.Action("ViewJustTicker", "Ticker", new { area = "Tools", id = ViewContext.RouteData.Values["id"].ToString() }, null)";
      $.ajax({
        url: newurl,
        type: "GET",
        success: (response: any) => {
          if (response !== null) {
            $("#divstatusinfo").html(response);
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  function refreshprojectheading(LogEntryGUID: string, projectGUID: string) {
    if (projectGUID === currentProjectGUID) {
      const url = currentUrlPrefix() + "Incident/IncidentHome/GetProjectHeadingNoCache/" + currentProjectGUID;
      // "@Url.Action("GetProjectHeading", "IncidentHome", new { area = "Incident", id = ViewContext.RouteData.Values["id"].ToString() }, null)";
      $.ajax({
        url: url,
        type: "GET",
        success: (response: any) => {
          if (response !== null) {
            $("#projectheading").html(response);
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }

  //********************what is this??
  function closeWindow() {
    const window = $("#unackWindow").data("kendoWindow");
    window.close();
  }
  export function acknowledgeAlarm(alarmGUID) {
    if (alarmGUID.length > 0) {
      var winUrl = currentUrlPrefix() + "Tools/Alert/Dismiss/" + currentProjectGUID + "?AlarmGUID=" + alarmGUID;
      $Ajax.ajaxAntiForgery({
        url: winUrl,
        type: "POST",
        success: response => {
          if (response.success === false) {
            Main.notifyMessage(response.Message, "danger");
          } else {
            const data = $("#telAlertGrid").data("kendoGrid").dataSource;
            data.read();
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  export function alertUnAckWindowonRemove(e: any) {
    alertitemRemoved = true;
  }
  export function dismissallalerts() {
    if ($("#telAlertGrid").length > 0) {
      const unAckGridSource = $("#telAlertGrid").data("kendoGrid").dataSource;
      if (unAckGridSource.total() > 0) {
        const urlToSend = currentUrlPrefix() + "Tools/Alert/DismissAll/" + currentProjectGUID;
        // "@Url.Action("DismissAll", "Alert", new { area = "Tools", id = ViewContext.RouteData.Values["id"].ToString() }, null)";
        $.ajax({
          url: urlToSend,
          type: "POST",
          contentType: "application/json; charset=utf-8",
          success: (response: any) => {
            if (response) {
              closeWindow();
            }
          },
          error: (xhr, status, error) => {
            Main.handlejqerr(xhr, status, error);
          },
        });
      }
    }
  }

  function getAlertGridContents(callback) {
    $.ajax({
      url: currentUrlPrefix() + "api/AlertAPI/_GetUnacknowledgedAlerts/" + currentProjectGUID,
      type: "GET",
      async: false,
      success: (response: any) => {
        if (response !== null) {
          callback(response);
        }
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
  function initAlertGrid() {
    refreshalertwindowGrid(currentProjectGUID);
    if ($("#telAlertGrid")) {
      const grid = $("#telAlertGrid").data("kendoGrid");
      checkAndHandleGridStatus();
    }
  }
  function refreshalertwindowGrid(projectGUID: string) {
    if ($("#telAlertGrid")) {
      const grid = $("#telAlertGrid").data("kendoGrid");
      getAlertGridContents(function(dataResp) {
        for (var i = 0; i < dataResp.length; i++) {
          const tempDate = moment(new Date(dataResp[i].FormattedDateCreated));
          dataResp[i].FormattedDateCreated = tempDate.format("lll");
        }
        if (dataResp && dataResp.length > 0) {
          grid.dataSource.data(dataResp);
        }
        checkAndHandleGridStatus();
      });
    }
  }
  function checkAndHandleGridStatus() {
    const grid = $("#telAlertGrid").data("kendoGrid");
    if (grid) {
      if (grid.dataSource.total() === 0) {
        // no records
        closeWindow();
      } else {
        if (alertitemRemoved) {
          alertitemRemoved = false;
        } else {
          openWindow();
        }
      }
    }
  }
  //function viewRelated(e: any) {
  //    e.preventDefault();
  //    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
  //    var wnd = $("#Details").data("kendoWindow");
  //    // console.log(dataItem);
  //    if (dataItem.AlertDetails.length > 0) {
  //        var winUrl = currentUrlPrefix() + "Tools/Alert/GetQuickLink/" + currentProjectGUID + "?alarmID=" + dataItem.AlarmGUID;
  //        var win = window.open("about:blank', '_blank");
  //        $.ajax({
  //            url: winUrl,
  //            type: "GET",
  //            success: (response: any) => {
  //                if (response) {
  //                    // console.log(response);
  //                    // window.open(response);
  //                    win.location.href = response;
  //                } else {
  //                    console.log("response is null");
  //                    win.close();
  //                }
  //            },
  //            error: (xhr, status, error) =>{
  //                Main.handlejqerr(xhr, status, error);
  //            }
  //        });
  //    }
  //}
  export function printDetailsList(data, alarmGUID: string) {
    let result = decodeURI('<ul class="list-unstyled">');
    if (data) {
      const j = data.length;
      for (let i = 0; i < j; i++) {
        result += "<li>";
        if (data[i].IsLink) {
          // var linkURL = '@Url.Action("ViewDetailLink", "Alert", new { area = "Tools", id = Model.ProjectGUID }, Request.Url.Scheme)?AlarmID=' + alarmGUID +
          const linkURL =
            currentUrlPrefix() +
            "Tools/Alert/ViewDetailLink/" +
            currentProjectGUID +
            "?AlarmID=" +
            alarmGUID +
            "&detailGUID=" +
            data[i].ID +
            "&detailTitle=" +
            data[i].DisplayTitle;
          result += decodeURI('<a target="_blank" href="' + linkURL + '">');
          result += data[i].DisplayTitle;
          result += ": " + data[i].Text;
          result += "</a>";
        } else {
          result += "<label>" + data[i].DisplayTitle + ": " + data[i].Text;
          +"</label>";
        }
        result += "</li>";
      }
      result += "</ul>";
    }
    return result;
  }
  //********************

  // default dragging/dropping methods
  export function draggableOnDragStart(e: any) {
    $(e.currentTarget).addClass("dragging");
    $(".dropable").removeClass("dropping");
  }
  export function draggableOnDragEnd(e: any) {
    $(e.currentTarget).removeClass("dragging");
  }
  export function droptargetOnDragEnter(e: any) {
    $(e.dropTarget).addClass("dropping");
  }
  export function droptargetOnDragLeave(e: any) {
    $(e.dropTarget).removeClass("dropping");
  }
  export function GenerateDragAndDropWidget(element, gridID) {
    var uid = element.attr("data-uid");
    let dataItem = $("#" + gridID)
      .data("kendoGrid")
      .dataSource.getByUid(uid);
    var item = $(
      '<div class="k-grid k-widget" style="background-color: DarkOrange; color: black; width: 50%;"><table><tbody><tr>' +
        element.html() +
        "</tr></tbody></table></div>",
    );
    element.attr("id", dataItem.id);
    return item;
  }
  // *********************************
  function getCustomMenu() {
    const newurl = currentUrlPrefix() + "Admin/Position/GetCustomMenu/" + currentProjectGUID;
    $.ajax({
      url: newurl,
      type: "GET",
      cache: true,
      success: response => {
        if (response !== null) {
          if (response.success !== false) {
            $("#divCustomMenu").html(response);
            $("#btncustomMenu").attr("style", "display: normal");
          } else {
            $("#divCustomMenu").html("");
            $("#btncustomMenu").attr("style", "display: none");
          }
        }
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
  export function getCurrentPositionText() {
    const newurl = currentUrlPrefix() + "Admin/Position/GetCurrentPosition/" + currentProjectGUID;
    $("#curPosText").text(globalPrompts.LoadingPrompt);
    $.ajax({
      url: newurl,
      type: "GET",
      success: (response: any) => {
        if (response.success === false) {
          // do nothing
        } else {
          if (response.length > 0) {
            $("#curPosAnchor").prop(
              "title",
              globalPrompts.CurrentPositionPrompt + response + ", " + globalPrompts.ClickToChangePrompt,
            );
            $("#curPosText").text(response);
            $("#curPosAnchor").attr("style", "display: inherit");
          } else {
            $("#curPosAnchor").prop("title", globalPrompts.ClickToChangePrompt);
            $("#curPosText").text("");
            $("#curPosAnchor").attr("style", "display: none");
          }
        }
      },
      error: (xhr, status, error) => {
        $("#curPosText").text("");
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
  export function selectPositionLoaded() {
    //$(".unichng").attr("disabled", "disabled");
    $("#btnSelPos").removeAttr("disabled");
    $("#btnSelNoPos").removeAttr("disabled");
  }
  // position changing methods
  export function loadPositionListView(id: string, posData) {
    const srcUrl = currentUrlPrefix() + "Home/_GetPositionList/" + id;
    const dataSource = new kendo.data.DataSource({
      // data: posData,    //would rather use data rather than the URL, but for some reason it's not reading correctly.  keep getting a ToolRoleName is undefined error
      transport: {
        read: {
          url: srcUrl,
        },
      },
      // parameterMap: function (options, operation) {
      //    if (operation !== "read" && options.models) {
      //        return { models: kendo.stringify(options.models) };
      //    }
      // },
      schema: {
        model: {
          id: "ToolRoleGUID",
          fields: {
            IncidentTypeAsString: {
              editable: false,
            },
            ToolRoleGUID: {
              editable: false,
            },
            ToolRoleName: {
              editable: false,
            },
            FormattedDateCreated: {
              type: "date",
            },
            ToolRoleDescription: {
              editable: false,
            },
          },
        },
      },
    });
    const listView = $("#poslst").data("kendoListView");
    listView.setDataSource(dataSource);
    listView.dataSource.read();
    $("#choosePositionModal").modal("show");
  }
  export function checkForPositionVal(urlToCheck, id) {
    $("#txtSelPrj").val(id);
    $Ajax.ajaxAntiForgery({
      url: urlToCheck + "/" + id,
      type: "GET",
      success: response => {
        if (response.success === false) {
          Main.notifyMessage(response.Message, "danger");
        } else {
          if (response.AskForPosition === false) {
            moveToDefaultPage();
          } else {
            loadPositionListView(id, response.Positions);
          }
        }
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }

  export function moveToDefaultPage() {
    let idval;
    if ($("#txtSelPrj") && $("#txtSelPrj").val().length > 0) {
      idval = $("#txtSelPrj").val();
    } else {
      idval = currentProjectGUID;
    }
    const winUrl = currentUrlPrefix() + "Incident/IncidentHome/DefaultPage/" + idval;
    window.location.href = winUrl;
  }
  export function removepositions() {
    blockit($("#main"));
    let idval;
    if ($("#txtSelPrj") && $("#txtSelPrj").val().length > 0) {
      idval = $("#txtSelPrj").val();
    } else {
      idval = currentProjectGUID;
    }
    $Ajax.ajaxAntiForgery({
      url: currentUrlPrefix() + "Home/EnterIncidentWithPosition/" + idval,
      type: "POST",
      success: (response: any) => {
        if (response.success === false) {
          unblockit($("#main"));
          $("#txtValSummPos").text(response.Message);
        } else {
          //close window to avoid UI confusion
          $("#choosePositionModal").modal("hide");
          //redirect to new page, but with new chosen positions
          moveToDefaultPage();
        }
      },
      error: (xhr, status, error) => {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }

  export function selectPosition() {
    const widget = $("#poslst").data("kendoListView");
    const selectedItems = widget.select();
    let posName = "";
    let idval;
    if ($("#txtSelPrj") && $("#txtSelPrj").val().length > 0) {
      idval = $("#txtSelPrj").val();
    } else {
      idval = currentProjectGUID;
    }
    if (selectedItems.length) {
      blockit($("#main"));
      posName = selectedItems
        .map(function() {
          return (<ToolRoleObject>widget.dataItem(this)).ToolRoleGUID;
        })
        .toArray()
        .join(" ,");
      $Ajax.ajaxAntiForgery({
        url: currentUrlPrefix() + "Home/EnterIncidentWithPosition/" + idval,
        type: "POST",
        data: {
          PositionGuids: posName,
        },
        success: (response: any) => {
          if (response.success === false) {
            unblockit($("#main"));
            $("#txtValSummPos").text(response.Message);
          } else {
            //close window to avoid UI confusion
            $("#choosePositionModal").modal("hide");
            // redirect to new page, but with new chosen positions
            moveToDefaultPage();
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }

  export function checkNull(val) {
    if (val === null) {
      return "";
    } else {
      return val;
    }
  }
  export function initgoogmap() {
    // do nothing, for now
  }

  function showfriendlyBootMessage(fromUser: string) {
    // i want to clear their data before the message, so they're already out
    const newurl = currentUrlPrefix() + "Account/RedirectToLockout?lockoutString=" + fromUser;
    window.location.href = newurl;
  }
  // ******************************************************
  export function filterStateList() {
    return {
      CountryCode: $("#Country").val(),
    };
  }
  export function HistoryPri_Databound(priority, textData) {
    let thereturn = "<span ";
    if (priority === 40) {
      thereturn = thereturn + "class='badge badge-danger' ";
    }
    thereturn = thereturn + ">" + textData + "</span>";
    return thereturn;
  }

  /**
   * @deprecated Use standalone version if webpacking
   * @param text
   * @param maxlength
   */
  export function textFormatter(text: string, maxlength: number) {
    if (text && text.length > maxlength) {
      return text.substring(0, maxlength) + "<i class='fas fa-ellipsis-h' title='" + htmlEncode(text) + "'></i>";
    } else {
      return text;
    }
  }

  /**
   * @deprecated Use standalone version when webpacking
   * @param value
   */
  export function htmlEncode(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    //https://stackoverflow.com/questions/14346414/how-do-you-do-html-encode-using-javascript
    return $("<div/>")
      .text(value)
      .html();
  }

  export function parseLogLinks(logGUIDs) {
    let ret = "";
    if (logGUIDs !== null && logGUIDs.length > 0) {
      for (let x = 0; x < logGUIDs.length; x++) {
        const linkURL =
          currentUrlPrefix() + "Incident/IncidentHome/GetToolLinkURL/" + currentProjectGUID + "?logGUID=" + logGUIDs[x];
        ret =
          ret +
          "<sup><a class='btn btn-link btn-sm' title='Click to view associated entry' href='" +
          linkURL +
          "' target='_blank' rel='noopener noreferrer'><span class='fa fa-link'></span></a></sup>";
      }
      //ret = "<sup><ul class='list-inline'>";
      //for (var x = 0; x < logGUIDs.length; x++) {
      //    var linkURL = currentUrlPrefix() + "Incident/IncidentHome/GetToolLinkURL/" + currentProjectGUID + "?logGUID=" + logGUIDs[x];
      //    ret = ret + "<li><a class='btn btn-link btn-sm' title='Click to view associated entry' href='" + linkURL + "' target='_blank' rel='noopener noreferrer'>" + x + "</a></li>";
      //}
      //ret = ret + "</ul></sup>";
    }
    return ret;
  }

  //http://www.telerik.com/forums/how-to-clear-selected-files-on-file-upload-control-after-a-successful-upload
  //http://www.telerik.com/forums/reset-upload
  export function clearKendoUpload(uploadToClear: string) {
    if (uploadToClear !== null && uploadToClear !== undefined && uploadToClear.length > 0) {
      $("#" + uploadToClear + " .k-upload-files").remove();
      $("#" + uploadToClear)
        .closest(".input-group")
        .find(".k-file")
        .remove();
      $("#" + uploadToClear + " .k-upload-status").remove();
      $("#" + uploadToClear)
        .closest(".input-group")
        .find(".k-upload-status")
        .remove();
      $("#" + uploadToClear + " .k-upload.k-header").addClass("k-upload-empty");
      $("#" + uploadToClear)
        .closest(".input-group")
        .find(".k-upload.k-header")
        .addClass("k-upload-empty");
      $("#" + uploadToClear + " .k-upload-button").removeClass("k-state-focused");
      $("#" + uploadToClear)
        .closest(".k-upload-button")
        .find(".k-upload.k-header")
        .removeClass("k-state-focused");
    } else {
      //$(".k-upload-files.k-reset").find("li").remove();
      $(".k-upload-files").remove();
      $(".k-upload-status").remove();
      $(".k-upload.k-header").addClass("k-upload-empty");
      $(".k-upload-button").removeClass("k-state-focused");
    }
    //$(".k-upload-files.k-reset").find("li").parent().remove();
    //$(".k-widget.k-upload").find("ul").remove();
    ////reset all the upload things!
    //$(".k-upload-files").remove();
    //$(".k-upload-status").remove();
    //$(".k-upload.k-header").addClass("k-upload-empty");
    //$(".k-upload-button").removeClass("k-state-focused");
  }

  /**
   * @deprecated use standalone function import instead if possible
   * @param divToBlock
   */
  export function blockit(divToBlock) {
    if (divToBlock === undefined || divToBlock === null) {
      return;
    }
    //divToBlock.addClass("blockedElement");
    //feel free to use jquery.BlockUI here instead.  just need to gulp it.
    divToBlock.block({
      message: "<h5>" + globalPrompts.LoadingPrompt + "</h5>",
      css: { border: "3px solid #a00", padding: 5 },
    });
  }

  /**
   * @deprecated Use standalone version if webpacking
   * @param divToBlock
   */
  export function unblockit(divToBlock) {
    if (divToBlock === undefined || divToBlock === null) {
      return;
    }
    //divToBlock.removeClass("blockedElement");
    divToBlock.unblock();
  }
  export function ClearTreeSelection(treeGridID) {
    var treeView = $(treeGridID).data("kendoTreeList");
    treeView.select($());
  }
  export function changePageSize(gridName): void {
    const ispaging = showIsPagingChecked();
    const grid = $(gridName).data("kendoGrid");
    if (ispaging) {
      const pagesize = $("#pagesize")
        .data("kendoNumericTextBox")
        .value();
      grid.dataSource.pageSize(pagesize);
    } else {
      grid.dataSource.pageSize(grid.dataSource.total());
    }
    grid.refresh();
  }
  function showIsPagingChecked(): boolean {
    if ($("#ispaging").is(":checked")) {
      return true;
    } else {
      return false;
    }
  }
  export function markObjectAsError(inputObject) {
    if (inputObject !== null) {
      //inputObject.toggleClass("input-validation-error")
      inputObject.addClass("input-validation-error");
      inputObject.attr("aria-describedby", inputObject.name + "-error");
      inputObject.attr("aria-required", "true");
    }
  }
  export function clearObjectErrorStatus(inputObject) {
    if (inputObject !== null) {
      //inputObject.toggleClass("input-validation-error")
      inputObject.removeClass("input-validation-error");
      inputObject.removeAttr("aria-describedby");
    }
  }
  export function htmlEscape(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  export function stripHtml(str) {
    return str.replace(/<((table|tbody|tr|td|img)|(\/table|\/tbody|\/tr|\/td|\/img)).*?>|&nbsp;/g, "");
  }
  export function htmlUnescape(str) {
    var tmp = document.createElement("htmlStrip");
    tmp.innerHTML = str;
    return tmp.textContent || tmp.innerText || "";
  }

  export function validatePhoneNumber(str) {
    /* eslint-disable-next-line no-useless-escape */
    return /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[0-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[0-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))$/g.test(
      str,
    );
  }

  //https://www.regular-expressions.info/email.html
  export function validateEmailAddr(str) {
    /* eslint-disable-next-line no-useless-escape */
    return /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
      str,
    );
  }

  export function resizeAllTextAreas() {
    $("textarea").each(function() {
      resizeSpecificTextArea(this);
    });
  }
  function resizeSpecificTextArea(ta) {
    if (!ta) {
      return;
    }

    //This ideas seems super popular, but gives me WAY too much space.  Not a fan
    //var lines = ta.value.split('\n');
    //var width = ta.cols;
    //var height = 1;
    //for (var i = 0; i < lines.length; i++) {
    //    var linelength = lines[i].length;
    //    if (linelength >= width) {
    //        height += Math.ceil(linelength / width);
    //    }
    //}
    //height += lines.length;
    //ta.rows = height;

    //This way works better, but doesn't look as great on print.  i have to add my own padding.
    /* Accounts for rows being deleted, pixel value may need adjusting */
    if (ta.clientHeight === ta.scrollHeight) {
      ta.style.height = "30px";
    }
    let maxHeight = null;
    let adjustedHeight = ta.clientHeight;
    if (!maxHeight || maxHeight > adjustedHeight) {
      /* i needed a little more padding on the printout, so i added 30.  Hacky!*/
      adjustedHeight = Math.max(ta.scrollHeight, adjustedHeight) + 30;
      if (maxHeight) {
        adjustedHeight = Math.min(maxHeight, adjustedHeight);
      }
      if (adjustedHeight > ta.clientHeight) {
        ta.style.height = adjustedHeight + "px";
      }
    }
  }

  export function changeNewLine(text) {
    /*eslint-disable-next-line no-control-regex*/
    const regexp1 = new RegExp("\r\n", "g");
    /*eslint-disable-next-line no-control-regex*/
    const regexp2 = new RegExp("\n", "g");
    if (text) {
      text = text.replace(regexp1, "<br/>");
      text = text.replace(regexp2, "<br/>");
    } else {
      text = "";
    }
    return text;
  }

  export function SetGridFilterSettingsOnOpen(e) {
    e.container
      .find('[data-bind="value: filters[0].operator"]')
      .data("kendoDropDownList")
      .value("contains");
    e.container
      .find('[data-bind="value: filters[0].operator"]')
      .data("kendoDropDownList")
      .trigger("change");
    e.container
      .find('[data-bind="value: filters[1].operator"]')
      .data("kendoDropDownList")
      .value("contains");
    e.container
      .find('[data-bind="value: filters[1].operator"]')
      .data("kendoDropDownList")
      .trigger("change");
  }

  export function ExcelExportFormateColForDateTime(colIndex, excel) {
    let cellFormat = "MM-dd-yyyy hh:mm:ss";
    const twoLetterLang = currentLang.substring(0, 2);

    switch (twoLetterLang) {
      case "en":
        switch (currentLang) {
          case "en-GB":
          case "en-XX":
            cellFormat = "dd/MM/yyyy hh:mm:ss";
            break;
          case "en-US":
            cellFormat = "MM/dd/yyyy hh:mm:ss";
            break;
        }
        break;
      case "jp":
      case "ja":
        cellFormat = "yyyy/MM/dd HH:mm:ss";
        break;
      case "fr":
      case "nl":
      case "de":
      case "ar":
      case "pt":
      case "tr":
        cellFormat = "dd/MM/yyyy hh:mm:ss";
        break;
      default:
        cellFormat = "MM/dd/yyyy hh:mm:ss";
        break;
    }

    excel.workbook.sheets[0].columns[colIndex].width = 150;
    for (let i = 1; i < excel.workbook.sheets[0].rows.length; i++) {
      excel.workbook.sheets[0].rows[i].cells[colIndex].format = cellFormat;
    }
  }

  export function IsValidJsonString(str) {
    if (str === undefined || str === null || str.length === 0) {
      return false;
    }
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  export function cleanExcelText() {
    var element = document.querySelector(".k-grid-excel");
    element.innerHTML = element.innerHTML.replace(
      (<HTMLElement>element).innerText,
      "&nbsp;&nbsp;" + (<HTMLElement>element).innerText,
    );
  }
}
