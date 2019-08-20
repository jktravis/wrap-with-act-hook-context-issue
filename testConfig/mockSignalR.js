/**
 * Global mock for SignalR
 */
global.$ = {
  connection: {
    hub: {
      start: jest.fn()
    },
    cobraHub: {
      client: {
        logentryUpdated: jest.fn()
      }
    }
  }
};
