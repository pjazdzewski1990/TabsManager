/// TODO: investigate background pages for imports to work, sadly it's not loading as specified in the docs
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Background_scripts
//import {setLastClosedTabAsync} from './src/model.js';
// as a workaround I copy the setting code here, rather than sharing it
const lastClosedTabStorageKey = "lastClosedTabId";
function setLastClosedTabAsync(tabId) {
    //TODO: should we store the last X rather than 1?
    const lastClosedTabIdObj = {};
    lastClosedTabIdObj[lastClosedTabStorageKey] = tabId;
    return browser.storage.local.set(lastClosedTabIdObj);
}

// manage the badge UI
function updateCount(tabId, isOnRemoved) {
  return browser.tabs.query({})
      .then((tabs) => {
        let length = tabs.length;

        // onRemoved fires too early and the count is one too many.
        // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
        if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
          length--;
        }

        browser.browserAction.setBadgeText({text: length.toString()});
        browser.browserAction.setBadgeBackgroundColor({'color': 'yellow'});
      });
}

// manage tab closing
browser.tabs.onRemoved.addListener((tabId) => {
    console.log(`The tab with id: ${tabId}, is closing`);
    updateCount(tabId, true);

    // update the information on the last closed tab
    // this information is stored in the local storage of the app, so we can retrieve it later and in other parts of the app
    setLastClosedTabAsync(tabId);
});

browser.tabs.onCreated.addListener((tabId) => {
    updateCount(tabId, true);
});

updateCount();