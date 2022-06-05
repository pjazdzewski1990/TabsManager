// functions to handle UI updates

export function clearList(listElem) {
  while (listElem.firstChild) {
    listElem.removeChild(listElem.lastChild);
  }
};

export function listTabs(tabsStateP) {
  tabsStateP.then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    // clear list
    clearList(tabsList);
    // prepare elements
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
    // .. or a placeholder if empty
    if(tabs.length === 0) {
        appendEmptyPlaceholder(currentTabs);
    }
    // fill list
    tabsList.appendChild(currentTabs);
  });
};

function appendEmptyPlaceholder(currentTabs) {
    const newListElem = document.createElement('li');
    newListElem.textContent = "Nothing found...";
    currentTabs.appendChild(newListElem);
}