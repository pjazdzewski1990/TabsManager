// the 'main' of the application

import {refreshTabsState} from './db.js';
import {clearList, listTabs} from './ui.js';
import {debounce} from './utils.js';

const storedTabsStateP = refreshTabsState();

function filterTabState(tabs, stringQuery) {
    // input like "foo   BAR" becomes a "foo|bar" regexp
    const searchExpression = stringQuery.toLowerCase().replace(/\s+/g, "|");

    return tabs.filter((tab) => {
        const searchContent = (tab.title).toLowerCase();
        const wasFound = new RegExp(searchExpression).test(searchContent);
        console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
        return wasFound;
    });
};

function failureCallback(error) {
    console.log("Render failed", error);
};

function render() {
    const stringQuery = document.getElementById("search-field").value;
    storedTabsStateP
        .then(tabs => filterTabState(tabs, stringQuery))
        .then(tabs => listTabs(tabs))
        .catch(failureHandler);
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
          browser.tabs.update(tabId, { active: true  });
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
  //TODO: update state!
});


// handle search
document.getElementById("search-field").addEventListener('keyup', debounce( () => {
    render();
}, 500));
