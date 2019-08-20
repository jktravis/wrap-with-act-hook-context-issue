import { Machine } from "xstate";
import { equals } from "ramda";

enum LoadingStatusEvents {
  onLoad = "onLoad",
  onFailure = "onFailure",
  onSuccess = "onSuccess",
  onReset = "onReset",
}

enum LoadingStates {
  NotStarted = "NotStarted",
  IsLoading = "IsLoading",
  Success = "Success",
  Failure = "Failure",
}

const loadingMachine = Machine({
  id: "root",
  on: {
    [LoadingStatusEvents.onReset]: `#${LoadingStates.NotStarted}`,
  },
  states: {
    [LoadingStates.NotStarted]: {
      id: LoadingStates.NotStarted,
      on: { [LoadingStatusEvents.onLoad]: `#${LoadingStates.IsLoading}` },
    },
    [LoadingStates.IsLoading]: {
      id: LoadingStates.IsLoading,
      on: {
        [LoadingStatusEvents.onFailure]: `#${LoadingStates.Failure}`,
        [LoadingStatusEvents.onSuccess]: `#${LoadingStates.Success}`,
      },
    },
    [LoadingStates.Success]: {
      id: LoadingStates.Success,
      on: { [LoadingStatusEvents.onLoad]: `#${LoadingStates.IsLoading}` },
    },
    [LoadingStates.Failure]: {
      id: LoadingStates.Failure,
      on: { [LoadingStatusEvents.onLoad]: `#${LoadingStates.IsLoading}` },
    },
  },
  initial: LoadingStates.NotStarted,
});

const isNotStarted = equals(LoadingStates.NotStarted);
const isLoadedSuccess = equals(LoadingStates.Success);
const isLoading = equals(LoadingStates.IsLoading);
const isFailure = equals(LoadingStates.Failure);

function transitionLoading(currentState, event) {
  return loadingMachine.transition(currentState, event).value;
}

export { LoadingStatusEvents, LoadingStates, isFailure, isNotStarted, isLoadedSuccess, isLoading, transitionLoading };
export default loadingMachine;
