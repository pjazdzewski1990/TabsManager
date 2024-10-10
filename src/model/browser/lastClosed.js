export const lastClosedTabStorageKey = 'lastClosedTab';

/**
 * Obtain the last closed tab from the browser storage
 * @returns {Object} The stored, last closed, tab information
 */
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}

/**
 * Save the provided tab in browser local storage
 * @param {string} tab How long should we wait before running the callback
 */
export function setLastClosedTabAsync(tab) {
  const lastClosedTabObj = {};
  console.log("lastClosedTabStorageKey", lastClosedTabStorageKey);
  lastClosedTabObj[lastClosedTabStorageKey] = tab;
  // eslint-disable-next-line no-undef
  return browser.storage.local.set(lastClosedTabObj);
}