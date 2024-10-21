/* eslint-disable import/extensions */
import { setLastClosedTabAsync } from './model/browser/lastClosed.js';

/**
 * Queries the browser for open tabs, then shows the count on the badge
 * @param {number} tabId Identifier of the tab that caused the update
 * @param {boolean} isOnRemoved Was the update caused by a removal
 * @returns {Promise} Promise that completes when the update was done
 */
function updateCount(tabId, isOnRemoved) {
  // eslint-disable-next-line no-undef
  return browser
    .tabs
    .query({})
    .then((tabs) => {
      let { length } = tabs;
      // onRemoved fires too early and the count is one too many.
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
      if (isOnRemoved && tabId && tabs.map((t) => t.id).includes(tabId)) {
        length -= 1;
      }
      // eslint-disable-next-line no-undef
      browser.browserAction.setBadgeText({ text: length.toString() });
      // eslint-disable-next-line no-undef
      browser.browserAction.setBadgeBackgroundColor({ color: 'yellow' });
    });
}

/**
 * Adds a callback to track tabs closing:
 * - update the badge counter
 * - store the last seen tab
 */
// eslint-disable-next-line no-undef
browser.tabs.onRemoved.addListener((tabId) => {
  console.log(`The tab with id: ${tabId}, is closing`);
  updateCount(tabId, true);

  // update the information on the last closed tab
  // this information is stored in the local storage of the app,
  // so we can retrieve it later and in other parts of the app
  // FF doesn't make it particularly easy - we need to access the storage to get it out
  // eslint-disable-next-line no-undef
  const saveP = browser.tabs.query({ currentWindow: true })
    .then((tabs) => {
      const beingClosed = tabs.filter((tab) => tab.id === tabId);
      return beingClosed;
    })
    // we save the full tab object in case something is needed
    .then((tabs) => ((tabs.length > 0) ? { ...tabs[0] } : {}))
    .then((tab) => setLastClosedTabAsync(tab));
  return saveP;
});

/**
 * Adds a callback to track tabs opening:
 * - update the badge counter
 */
// eslint-disable-next-line no-undef
browser.tabs.onCreated.addListener((tabId) => {
  updateCount(tabId, true);
});

/**
 * When the plugin loads we will set the bad to the initial value
 */
updateCount();
