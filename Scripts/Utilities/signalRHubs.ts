/* global
currentUrlPrefix
 */
/* eslint-disable
dot-notation
*/
/*!
 * ASP.NET SignalR JavaScript Library v2.3.0-rtm
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

(function($, window, undefined) {
  /// <param name="$" type="jQuery" />
  "use strict";

  if (typeof $.signalR !== "function") {
    throw new Error(
      "SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.",
    );
  }

  var signalR = $.signalR;

  function makeProxyCallback(hub, callback) {
    return function() {
      // Call the client hub method
      callback.apply(hub, $.makeArray(arguments));
    };
  }

  function registerHubProxies(instance, shouldSubscribe) {
    var key, hub, memberKey, memberValue, subscriptionMethod;

    for (key in instance) {
      if (instance.hasOwnProperty(key)) {
        hub = instance[key];

        if (!hub.hubName) {
          // Not a client hub
          continue;
        }

        if (shouldSubscribe) {
          // We want to subscribe to the hub events
          subscriptionMethod = hub.on;
        } else {
          // We want to unsubscribe from the hub events
          subscriptionMethod = hub.off;
        }

        // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
        for (memberKey in hub.client) {
          if (hub.client.hasOwnProperty(memberKey)) {
            memberValue = hub.client[memberKey];

            if (!$.isFunction(memberValue)) {
              // Not a client hub function
              continue;
            }

            // Use the actual user-provided callback as the "identity" value for the registration.
            subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue), memberValue);
          }
        }
      }
    }
  }

  $.hubConnection.prototype.createHubProxies = function() {
    var proxies = {};
    this.starting(function() {
      // Register the hub proxies as subscribed
      // (instance, shouldSubscribe)
      registerHubProxies(proxies, true);

      this._registerSubscribedHubs();
    }).disconnected(function() {
      // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
      // (instance, shouldSubscribe)
      registerHubProxies(proxies, false);
    });

    proxies["cobraHub"] = this.createHubProxy("cobraHub");
    proxies["cobraHub"].client = {};
    proxies["cobraHub"].server = {
      broadcastAlarmUpdated: function(alarmGUID, projectGUID) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastAlarmUpdated"], $.makeArray(arguments)),
        );
      },

      broadcastLocatorReadings: function(readingID, serialNumber) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastLocatorReadings"], $.makeArray(arguments)),
        );
      },

      broadcastmultipleAlarmUpdated: function(alarmGUIDs, projectGUID) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastmultipleAlarmUpdated"], $.makeArray(arguments)),
        );
      },

      broadcastmultipleOrgIncidentUpdates: function(prjGUIDs, OrganizationName) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastmultipleOrgIncidentUpdates"], $.makeArray(arguments)),
        );
      },

      broadcastmultipleToIncidentWithTool: function(logList, projectGUID) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastmultipleToIncidentWithTool"], $.makeArray(arguments)),
        );
      },

      broadcastOrgIncidentUpdates: function(prjGUID, OrganizationName) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastOrgIncidentUpdates"], $.makeArray(arguments)),
        );
      },

      broadcastToIncident: function(logGUID, projectGUID) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["BroadcastToIncident"], $.makeArray(arguments)),
        );
      },

      broadcastToIncidentWithTool: function(logGUID, toolname, projectGUID, eventType) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["broadcastToIncidentWithTool"], $.makeArray(arguments)),
        );
      },

      stopWatchingIncidentChanges: function(id) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["StopWatchingIncidentChanges"], $.makeArray(arguments)),
        );
      },

      stopWatchingIncidents: function(OrganizationName) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["StopWatchingIncidents"], $.makeArray(arguments)),
        );
      },

      stopWatchingTool: function(toolname, id) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["StopWatchingTool"], $.makeArray(arguments)),
        );
      },

      watchIncidentChanges: function(id) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["WatchIncidentChanges"], $.makeArray(arguments)),
        );
      },

      watchIncidents: function(OrganizationName) {
        return proxies["cobraHub"].invoke.apply(
          proxies["cobraHub"],
          $.merge(["WatchIncidents"], $.makeArray(arguments)),
        );
      },

      watchTool: function(toolname, id) {
        return proxies["cobraHub"].invoke.apply(proxies["cobraHub"], $.merge(["WatchTool"], $.makeArray(arguments)));
      },
    };

    proxies["monitorHub"] = this.createHubProxy("monitorHub");
    proxies["monitorHub"].client = {};
    proxies["monitorHub"].server = {};

    return proxies;
  };

  //signalR.hub = $.hubConnection("/cobramvc4portal/signalr", { useDefaultPath: false });
  signalR.hub = $.hubConnection(currentUrlPrefix() + "signalr", { useDefaultPath: false });
  $.extend(signalR, signalR.hub.createHubProxies());
})((window as any).jQuery, window);
