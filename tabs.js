// the 'main' of the application

import {FirefoxAsyncTranslator, FirefoxTabProvider, FirefoxTabStorage, enrichTabState, filterTabState} from './src/model.js';
import {clearList, listTabs} from './src/ui.js';
import {debounce, navigateToTabId} from './src/utils.js';

var previousTimestamp = +new Date();
function tagTime(data) {
    const currentTimestamp = +new Date();
    console.log("@" + currentTimestamp + " since last timestamp: " + (currentTimestamp-previousTimestamp) + "ms");
    previousTimestamp = currentTimestamp;
    return data;
}

function failureHandler(error) {
    console.log("Render failed", error);
};

const storage = new FirefoxTabStorage();

function buildTranslatorAsync(storage) {
    return storage
        .getAsync()
        .catch(error => {
            // in case of a failure to access the storage we will just save the data
            failureHandler(error);
            return new Map();
        })
        .then(tabsData => new FirefoxAsyncTranslator(tabsData));
}

const tabsProvider = new FirefoxTabProvider();
const storedTabsStateP = tabsProvider.provide();
const tabsTranslatorP = buildTranslatorAsync(storage);

function render() {
    const stringQuery = document.getElementById("search-field").value;
    storedTabsStateP
        .then(tagTime)
        .then(tabs => tabsTranslatorP.then(tabsTranslator => enrichTabState(tabs, tabsTranslator)))
        .then(tabs => filterTabState(tabs, stringQuery))
        .then(tabs => listTabs(tabs))
        .then(tabs => setFirstLinkNavigation(tabs))
        .then(tagTime)
        .catch(failureHandler);
};

let defaultNavigateHandler = () => {
    console.log("Cannot navigate - no results found");
};

let navigateToFirstLink = defaultNavigateHandler;

function setFirstLinkNavigation(tabs) {
    if(tabs.length > 0) {
        const firstTabId = tabs[0].id;
        navigateToFirstLink = () => navigateToTabId(firstTabId);
    } else {
        navigateToFirstLink = defaultNavigateHandler;
    }
    return tabs;
};

// display UI when user clicks on the button
document.addEventListener("DOMContentLoaded", render);

// handle clicks
document.addEventListener("click", (e) => {
  // we cannot navigate with a simple href... this is the fix
  if (e.target.classList.contains('switch-tabs')) {
    //+ converts to number
    let tabId = +e.target.getAttribute('href');

    browser.tabs.query({
      currentWindow: true // search in current window
    }).then((tabs) => {
      for (var tab of tabs) {
        if (tab.id === tabId) {
          // make active
          navigateToTabId(tabId);
        }
      }
    });
  }

  e.preventDefault();
});

// handle tabs change
browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log(`The tab with id: ${tabId}, is closing`);
});

// handle tabs being moved
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  console.log(`Tab with id: ${tabId} moved from index: ${moveInfo.fromIndex} to index: ${moveInfo.toIndex}`);
});


// handle search
document.getElementById("search-field").addEventListener('keyup', debounce( (evt) => {
    console.log("Received:", evt.key);
    if(evt.key === "ArrowUp") {
        navigateToFirstLink();
    } else {
        render();
    }
}, 500));

// save data for later after X seconds
window.setTimeout(() => {
    tabsTranslatorP.then(translator => storage.upsertAsync(translator.tabTextToLanguageMap));
}, 5000);