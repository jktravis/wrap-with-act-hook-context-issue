/*eslint-disable
@typescript-eslint/no-namespace,
 */
/* global
$Ajax,
Main,
currentUrlPrefix,
*/
namespace Mobile {
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
    //var listView = $("#poslst").data("kendoListView");
    const listView = $("#poslst").data("kendoMobileListView");
    listView.setDataSource(dataSource);
    listView.dataSource.read();
    $("#choosePositionModal")
      .data("kendoMobileModalView")
      .open();
  }
  export function checkForPositionVal(urlToCheck, id) {
    $("#txtSelPrj").val(id);
    $Ajax.ajaxAntiForgery({
      url: urlToCheck + "/" + id,
      type: "GET",
      success: response => {
        if (response.success === false) {
          Main.notifyMessage({ message: response.Message }, { type: "danger" });
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
      idval = Main.currentProjectGUID;
    }
    const winUrl = currentUrlPrefix() + "Incident/IncidentHome/DefaultPage/" + idval;
    window.location.href = winUrl;
  }
  export function removepositions() {
    let idval;
    if ($("#txtSelPrj") && $("#txtSelPrj").val().length > 0) {
      idval = $("#txtSelPrj").val();
    } else {
      idval = Main.currentProjectGUID;
    }
    $Ajax.ajaxAntiForgery({
      url: currentUrlPrefix() + "Home/EnterIncidentWithPosition/" + idval,
      type: "POST",
      success: response => {
        if (response.success === false) {
          $("#txtValSummPos").text(response.Message);
        } else {
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
    let selectedItems = [];
    $("#poslst input:checked").each(function() {
      selectedItems.push($(this).attr("name"));
    });
    let posName = "";
    let idval;
    if ($("#txtSelPrj") && $("#txtSelPrj").val().length > 0) {
      idval = $("#txtSelPrj").val();
    } else {
      idval = Main.currentProjectGUID;
    }
    if (selectedItems.length) {
      posName = selectedItems.join(" ,");
      $Ajax.ajaxAntiForgery({
        url: currentUrlPrefix() + "Home/EnterIncidentWithPosition/" + idval,
        type: "POST",
        data: {
          PositionGuids: posName,
        },
        success: response => {
          if (response.success === false) {
            $("#txtValSummPos").text(response.Message);
          } else {
            //redirect to new page, but with new chosen positions
            moveToDefaultPage();
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
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
            displayBanner();
          }
        },
        error: (xhr, status, error) => {
          Main.handlejqerr(xhr, status, error);
        },
      });
    }
  }
  function displayBanner() {
    //$("#divConsent").kendoMobileModalView("open");
    $("#divConsent")
      .data("kendoMobileModalView")
      .open();
  }
  export function closeNoticeOfConsent() {
    //$("#divConsent").kendoMobileModalView("close");
    $("#divConsent")
      .data("kendoMobileModalView")
      .close();
  }

  export function LoadHeader(productName, title, font, imageurl, hiddenTitle: boolean) {
    if (title.length > 0) {
      let encodedTitle = "";
      if (title.includes(";&#")) {
        const items = title.split(";");
        for (var i = 0; i < items.length; i++) {
          items[i] = items[i].replace("&#", "");
          if (items[i].includes(" ")) {
            encodedTitle += " ";
          }
          encodedTitle += String.fromCharCode(parseInt(items[i]));
        }
      } else {
        encodedTitle = Main.htmlEncode(title);
      }
      if (!hiddenTitle && (font.length > 0 || imageurl.length > 0)) {
        //let headerText = "<div class='d-flex justify-content-start'>";
        //if (font.length > 0) {
        //headerText = headerText + '<span class="p-2"><i class="' + font + '"></i></span>';
        //} else if (imageurl.length > 0) {
        //i don't do this because if the image doesn't exist it crashes.  &404?
        //headerText = headerText + '<span class="p-2"><img alt="' + title + '" src="' + imageurl + '&w=25" /></span>';
        //}
        //headerText = headerText + "<h3>" + encodedTitle + "</h3></div>";
        const headerText = "<h3>" + encodedTitle + "</h3>";
        $("#bodyTitle").html(headerText);
      }
      document.title = productName + " - " + encodedTitle; //some duplicated effort here with ViewBag.Title
    }
  }
}
