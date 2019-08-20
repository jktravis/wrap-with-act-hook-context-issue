/**
 * Simple wrapper file to prevent the need to work directly with localForage
 */
import localforage from "localforage";

function getItem(key) {
  return localforage.getItem(key);
}

function setItem(key, value) {
  return localforage.setItem(key, value);
}

export { setItem, getItem };
