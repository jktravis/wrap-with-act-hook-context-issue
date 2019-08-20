/** global
 * Main
 */
import * as R from "ramda";

/**
 * Registers with SignalR.
 * @param {object} fns A key/value mapping where the key is the signalR function name and the value is the function to
 * call
 * @param {client => void} cb an optional callback for after the client has been started.
 */
function registerWithSignalR(fns, cb?) {
  let ms = 0;
  const intervalId = setInterval(() => {
    if (R.path(["connection", "cobraHub"], $)) {
      clearInterval(intervalId);

      Object.entries(fns).forEach(([key, fn]) => {
        $.connection.cobraHub.client[key] = fn;
      });

      $.connection.hub.start();
      cb && cb($.connection.cobraHub.client);
    } else {
      ms += 200;
    }

    if (ms > 10000) {
      clearInterval(intervalId);
      Main.notifyMessage({ message: "Unable to connect to websocket. Missing hub." }, "warning");
      /* eslint-disable-next-line no-console */
      console.warn("Unable to connect to websocket. Missing hub.");
    }
  }, 200);
}

export default registerWithSignalR;
