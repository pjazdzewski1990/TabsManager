// the 'main' of the application

import {filterTabState} from './src/model/search.js';
import {getLastClosedTabAsync, lastClosedTabStorageKey} from './src/model/browser/lastClosed.js';
import {enrichTabState} from './src/model/enrichedTab.js';
import {listTabs, showSimilarTab} from './src/ui.js';
import {debounce, navigateToTabId, runAfterDelay, defaultFailureHandler} from './src/utils.js';
import {tagTime} from './src/tagTime.js'
import {injectServices} from './src/inject.js';

var {
    storedTabsStateP,
    storage,
    tabsTranslatorP,
    tabsRecommender
} = injectServices();

function renderUI() {
    const stringQuery = document.getElementById("search-field").value;

    const similarToLastP = Promise.all([storedTabsStateP, getLastClosedTabAsync()])
        .then(tabsAndLastClosed => {
            const lastClosed = tabsAndLastClosed[1][lastClosedTabStorageKey.toString()];
            return tabsRecommender.recommend(lastClosed, tabsAndLastClosed[0]);
        })
        .then(mostSimilarTab => showSimilarTab(mostSimilarTab))
        .then(mostSimilarTab => setSimilarNavigation(mostSimilarTab))
        .catch(defaultFailureHandler);

    const tabsList = document.getElementById('tabs-list')

    const listRenderP = storedTabsStateP
        .then(tabs => tabsTranslatorP.then(tabsTranslator => enrichTabState(tabs, tabsTranslator)))
        .then(tabs => filterTabState(tabs, stringQuery))
        .then(tabs => listTabs(tabsList, tabs))
        .then(tabs => setFirstLinkNavigation(tabs))
        .catch(defaultFailureHandler);

    return Promise.all([similarToLastP, listRenderP]).then(tagTime("UI-render-done"));
};

function storeUIState() {
    // save data for later after X seconds
    return runAfterDelay(4000)
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