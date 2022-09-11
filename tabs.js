// the 'main' of the application

import {getLastClosedTabAsync, FirefoxAsyncTranslator, FirefoxTabProvider, FirefoxTabStorage, enrichTabState, filterTabState} from './src/model.js';
import {clearList, listTabs, showSimilarTab} from './src/ui.js';
import {debounce, navigateToTabId, runAfterDelay} from './src/utils.js';

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

function renderUI() {
    const stringQuery = document.getElementById("search-field").value;

    const _storedTabsStateP = storedTabsStateP.then(tagTime);

    const similarToLastP = Promise.all([_storedTabsStateP, getLastClosedTabAsync()])
        .then(tabsAndLastClosed => {
            const saved = tabsAndLastClosed[0];
            //TODO: move it to service?
            const lastClosed = tabsAndLastClosed[1]["lastClosedTab"];
            console.log("Last closed tab was:", lastClosed);
            //TODO: pick the right tab!
            return saved[0];
        })
        .then(mostSimilarTab => showSimilarTab(mostSimilarTab))
        .then(mostSimilarTab => setSimilarNavigation(mostSimilarTab))
        .catch(failureHandler);

    const listRenderP = _storedTabsStateP
        .then(tabs => tabsTranslatorP.then(tabsTranslator => enrichTabState(tabs, tabsTranslator)))
        .then(tabs => filterTabState(tabs, stringQuery))
        .then(tabs => listTabs(tabs))
        .then(tabs => setFirstLinkNavigation(tabs))
        .then(tagTime)
        .catch(failureHandler);

    return Promise.all([similarToLastP, listRenderP]);
};

function storeUIState() {
    // save data for later after X seconds
    return runAfterDelay(5000)
        .then(() => tabsTranslatorP)
        .then(translator => storage.upsertAsync(translator.tabTextToLanguageMap));
}

// handle clicks
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

let navigateToSimilar = defaultNavigateHandler;

function setSimilarNavigation(tab) {
    const tabId = tab.id;
    navigateToSimilar = () => navigateToTabId(tabId);
    return tab;
};

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

// handle search
document.getElementById("search-field").addEventListener('keyup', debounce( (evt) => {
    if(evt.key === "ArrowUp") {
        navigateToSimilar();
    } if(evt.key === "ArrowDown") {
        navigateToFirstLink();
    } else {
        renderUI();
    }
}, 350));

// display UI when user clicks on the button
document.addEventListener("DOMContentLoaded", () => renderUI().then(storeUIState));