import * as R from "ramda";
import qs from "query-string";

/**
 * Append query parameters to a given URL. Accounts for existing params.
 * Params are processed with preprocessorFn.
 * @params {any => any} preprocessorFn The function that will be used to process the
 * params.
 * @params {any} The params. This value will be processed with the provided preprocessorFn
 * @params {string} url The url to append
 */
const appendUrlParamsWith = R.curry((preprocessorFn, params, url) => {
  if (R.includes("?", url)) {
    return `${url}&${preprocessorFn(params)}`;
  }

  return `${url}?${preprocessorFn(params)}`;
});

const isObject = R.compose(
  R.equals("Object"),
  R.type,
);

const isString = R.compose(
  R.equals("String"),
  R.type,
);

const getProcessorFn = R.cond([
  [isObject, R.always(qs.stringify)],
  [isString, R.always(R.identity)],
  [
    R.T,
    params => {
      /* eslint-disable no-console */
      console.error("appendUrlParams only works with objects and strings.");
      console.error(" Please use `appendUrlParamsWith` to create an alternative implementation");
      console.error("called with: ", params);
      /* eslint-enable no-console */
      return R.identity;
    },
  ],
]);

/**
 * Append query parameters to a given URL. Accounts for existing params
 * @params {object|string} params When an object, Key/value pair where the key is the name of the param, and
 * the value is the value of the param. When a string, no additional processing will occur.
 * This is a more specialized version of `appendUrlParamsWith`
 * @see appendUrlParamsWith
 * @params {string} url The url to append.
 * @returns {string}
 */
const appendUrlParams = R.curry((params, url) => {
  return appendUrlParamsWith(getProcessorFn(params), params, url);
});

export { appendUrlParamsWith, appendUrlParams };

export default appendUrlParams;
