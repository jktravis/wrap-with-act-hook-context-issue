import { append, curry, ifElse, includes, without } from "ramda";

/**
 * Toggle an item that exists in an array. Returns a new array with the item added, or
 * removed, depending on it's existence in the array. If the item already exists (using
 * `includes`), then the item will be removed. If the item does not exists in the array,
 * it will be added.
 * @example
 * const data = ['foo', 'bar'];
 * toggleItemInArray('baz')(data); // => ['foo', bar', 'baz']
 * toggleItemInArray('foo')(data); // => [bar']
 *
 * @param item
 * @returns {array}
 */
const toggleItemInArray = curry((item, data) => ifElse(includes(item), without([item]), append(item))(data));

export default toggleItemInArray;
