/// TODO: investigate background pages for imports to work,
// sadly it's not loading as specified in the docs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts
// import {setLastClosedTabAsync} from './src/model/model.js';
// as a workaround I copy the setting code here, rather than sharing it
const lastClosedTabStorageKey = 'lastClosedTab';
function setLastClosedTabAsync(tab) {
  // TODO: should we store the last X rather than 1?
  const lastClosedTabObj = {};
  lastClosedTabObj[lastClosedTabStorageKey] = tab;
  // eslint-disable-next-line no-undef
  return browser.storage.local.set(lastClosedTabObj);
}

// manage the badge UI
function updateCount(tabId, isOnRemoved) {
  // eslint-disable-next-line no-undef
  return browser.tabs.query({})
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

// manage tab closing
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

// eslint-disable-next-line no-undef
browser.tabs.onCreated.addListener((tabId) => {
  updateCount(tabId, true);
});

updateCount();
