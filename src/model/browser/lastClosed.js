export const lastClosedTabStorageKey = 'lastClosedTab';

/**
 * Obtain the last closed tab from the browser storage
 * @returns {Object} The stored, last closed, tab information
 */
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}