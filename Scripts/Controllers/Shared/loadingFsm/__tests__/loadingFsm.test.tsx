import loadingFsm, { LoadingStates, LoadingStatusEvents } from "../loadingFsm";

describe("loadingFsm", () => {
  it("should initialize to not started", () => {
    expect(loadingFsm.initialState.value).toEqual(LoadingStates.NotStarted);
  });

  it("should transition from not started to isLoading", () => {
    expect(loadingFsm.transition(LoadingStates.NotStarted, LoadingStatusEvents.onLoad).value).toEqual(
      LoadingStates.IsLoading,
    );
  });

  it("should transition from isLoading to success", () => {
    expect(loadingFsm.transition(LoadingStates.IsLoading, LoadingStatusEvents.onSuccess).value).toEqual(
      LoadingStates.Success,
    );
  });

  it("should transition from isLoading to failure", () => {
    expect(loadingFsm.transition(LoadingStates.IsLoading, LoadingStatusEvents.onFailure).value).toEqual(
      LoadingStates.Failure,
    );
  });

  it("should transition from Success to isLoading", () => {
    expect(loadingFsm.transition(LoadingStates.Success, LoadingStatusEvents.onLoad).value).toEqual(
      LoadingStates.IsLoading,
    );
  });
});
