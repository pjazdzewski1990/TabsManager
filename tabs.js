// the 'main' of the application

import {FirefoxTabProvider, FirefoxAsyncTranslator, enrichTabState, filterTabState} from './src/model.js';
import {clearList, listTabs} from './src/ui.js';
import {debounce, navigateToTabId} from './src/utils.js';

const tabsProvider = new FirefoxTabProvider();
const storedTabsStateP = tabsProvider.provide();
const tabsTranslator = new FirefoxAsyncTranslator();

function failureHandler(error) {
    console.log("Render failed", error);
};

function render() {
    const stringQuery = document.getElementById("search-field").value;
    storedTabsStateP
        .then(tabs => enrichTabState(tabs, tabsTranslator))
        .then(tabs => filterTabState(tabs, stringQuery))
        .then(tabs => listTabs(tabs))
        .then(tabs => setFirstLinkNavigation(tabs))
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
