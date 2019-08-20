import { curry, evolve, not } from "ramda";

/**
 * Create a new object with only the stateKey, the value of which is its negation.
 * Note: This is curried.
 * @link {https://ramdajs.com/docs/#curry}
 * @params {string} dataKey The key/property on the object
 * @params {state} data The object that has the key/property
 */
const createDataToggle = curry((dataKey: string, data: any) => evolve({ [dataKey]: not }, data));

export default createDataToggle;
