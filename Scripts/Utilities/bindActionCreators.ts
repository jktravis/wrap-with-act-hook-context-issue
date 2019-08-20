import * as R from "ramda";

/**
 * Binds a given dispatch function to the collection of action creators.
 * @param {any} actionCreators Object of action creators that will be bound to
 * @param {action => void} dispatch The dispatch function
 * the dispatch function
 */
const bindActionCreators = R.curry((actionCreators, dispatch) =>
  R.map(
    fn =>
      R.compose(
        dispatch,
        fn,
      ),
    actionCreators,
  ),
);

export default bindActionCreators;
