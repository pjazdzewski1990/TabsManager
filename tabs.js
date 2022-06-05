
// get new tabs info
function refreshTabsState() {
  return browser.tabs.query({currentWindow: true});
}

const storedTabsStateP = refreshTabsState();

function filterTabState(tabsStateP, stringQuery) {
    // input like "foo   BAR" becomes a "foo|bar" regexp
    const searchExpression = stringQuery.toLowerCase().replace(/\s+/g, "|");

    return tabsStateP.then((tabs) => {
        return tabs.filter((tab) => {
            const searchContent = (tab.title).toLowerCase();
            const wasFound = new RegExp(searchExpression).test(searchContent);
            console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
            return wasFound;
        });
    });
};

function clearList(listElem) {
  while (listElem.firstChild) {
    listElem.removeChild(listElem.lastChild);
  }
};

function listTabs(tabsStateP, stringQuery) {
  filterTabState(tabsStateP, stringQuery).then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    // clear list
    clearList(tabsList);

    let currentTabs = document.createDocumentFragment();
    for (let tab of tabs) {
        const tabLink = document.createElement('a');

        tabLink.textContent = ("#" + tab.id + " " + tab.title);
        tabLink.setAttribute('href', tab.id);
        tabLink.classList.add('switch-tabs');

        const newListElem = document.createElement('li');
        newListElem.appendChild(tabLink);
        currentTabs.appendChild(newListElem);
    }
    // fill list
    tabsList.appendChild(currentTabs);
  });
};

function render() {
    const stringQuery = document.getElementById("search-field").value;
    listTabs(storedTabsStateP, stringQuery);
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

  if(removeInfo.isWindowClosing) {
    console.log(`Its window is also closing.`);
  } else {
    console.log(`Its window is not closing`);
  }
});

// handle tabs being moved
browser.tabs.onMoved.addListener((tabId, moveInfo) => {
  console.log(`Tab with id: ${tabId} moved from index: ${moveInfo.fromIndex} to index: ${moveInfo.toIndex}`);
  //TODO: update state!
});


// handle search
function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
};

document.getElementById("search-field").addEventListener('keyup', debounce( () => {
    render();
}, 1000));
