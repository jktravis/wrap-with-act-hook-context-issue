/*eslint-disable
@typescript-eslint/camelcase,
@typescript-eslint/no-namespace,
*/
/* global
$Ajax,
Main,
*/
//import { Main } from './basicCoBRAScript';
//import { $Ajax } from './jqAjaxCSF';
namespace CoBARTS {
  export function LineItems_Databound(cellVal, staticguid) {
    let thereturn = '<div class="btn-group" ><button data-toggle="dropdown" ';
    if (cellVal === "Red") {
      thereturn = thereturn + 'class="btn btn-danger dropdown-toggle"><strong>Red';
    } else if (cellVal === "Yellow") {
      thereturn = thereturn + 'class="btn btn-warning dropdown-toggle"><strong>Yellow';
    } else if (cellVal === "Green") {
      thereturn = thereturn + 'class="btn btn-success dropdown-toggle"><strong>Green';
    } else if (cellVal === "Black") {
      thereturn = thereturn + 'class="btn btn-dark dropdown-toggle"><strong>Black';
    } else {
      thereturn = thereturn + 'class="btn dropdown-toggle"><strong>Grey';
    }
    thereturn =
      thereturn +
      '</strong>&nbsp;&nbsp;<span class="caret"></span></button><div class="dropdown-menu"  role="menu" ><a class="dropdown-item btn btn-danger" onclick="SetStatus(\'' +
      staticguid +
      "','Red');\">Red</a><a class=\"dropdown-item btn btn-warning\" onclick=\"SetStatus('" +
      staticguid +
      "','Yellow');\">Yellow</a><a class=\"dropdown-item btn btn-success\" onclick=\"SetStatus('" +
      staticguid +
      "','Green');\">Green</a><a class=\"dropdown-item btn btn-dark\" onclick=\"SetStatus('" +
      staticguid +
      "','Black');\">Black</a><a class=\"dropdown-item btn btn-secondary\" onclick=\"SetStatus('" +
      staticguid +
      "','Grey');\">Grey</a></div></div>";
    return thereturn;
  }
  export function LineItems_Databounddisabled(cellVal, staticguid) {
    let thereturn = "<span ";
    if (cellVal === "Red") {
      thereturn = thereturn + 'class="badge badge-danger"><strong>Red';
    } else if (cellVal === "Yellow") {
      thereturn = thereturn + 'class="badge badge-warning dropdown-toggle"><strong>Yellow';
    } else if (cellVal === "Green") {
      thereturn = thereturn + 'class="badge badge-success dropdown-toggle"><strong>Green';
    } else {
      thereturn = thereturn + 'class="badge badge-secondary"><strong>Grey';
    }
    thereturn = thereturn + "</strong></span>";
    return thereturn;
  }

  export function archiverow(staticGUID, logentryguid, theUrl, toolname) {
    $Ajax.ajaxAntiForgery({
      url: theUrl,
      type: "POST",
      data: {
        StaticGUID: staticGUID,
        LogEntryGUID: logentryguid,
        ToolName: toolname,
      },
      success: function(response) {
        if (response.success === false) {
          Main.notifyMessage({ message: response.Message }, { type: "danger" });
        } else {
          //do nothing
        }
      },
      error: function(xhr, status, error) {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }

  export function restoreEvent(theUrl, staticGUID, toolname) {
    $Ajax.ajaxAntiForgery({
      url: theUrl,
      type: "POST",
      data: {
        StaticGUID: staticGUID,
        ToolName: toolname,
      },
      success: function(response) {
        if (response.success === false) {
          Main.notifyMessage({ message: response.Message }, { type: "danger" });
        }
      },
      error: function(xhr, status, error) {
        Main.handlejqerr(xhr, status, error);
      },
    });
  }
}
