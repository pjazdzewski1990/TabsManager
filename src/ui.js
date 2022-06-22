// functions to handle UI updates

export function clearList(listElem) {
  while (listElem.firstChild) {
    listElem.removeChild(listElem.lastChild);
  }
};

export function listTabs(tabs) {
    let tabsList = document.getElementById('tabs-list');
    // clear list
    clearList(tabsList);
    // prepare elements
    let currentTabs = document.createDocumentFragment();
    for (let tab of tabs) {
        const langIcon = document.createElement('img');
        langIcon.alt = tab.languageCode;
        // in case of trouble translating - assume en
        // kudos to https://anandchowdhary.github.io/language-icons/
        // and https://flagicons.lipis.dev/
        let langLink = ("https://unpkg.com/language-icons/icons/" + tab.languageCode + ".svg");
        if(tab.languageCode.toLowerCase() === "later") {
            langLink = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/1x1/un.svg";
        }
        if(tab.languageCode.toLowerCase() === "unknown") {
            langLink = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/1x1/xx.svg";
        }
        langIcon.src = langLink;
        langIcon.classList.add('lang-icon');

        const tabLink = document.createElement('a');
        tabLink.textContent = ("#" + tab.id + " " + tab.title);
        tabLink.setAttribute('href', tab.id);
        tabLink.classList.add('switch-tabs');

        const newListElem = document.createElement('li');
        newListElem.appendChild(langIcon);
        newListElem.appendChild(tabLink);
        currentTabs.appendChild(newListElem);
    }
    // .. or a placeholder if empty
    if(tabs.length === 0) {
        appendEmptyPlaceholder(currentTabs);
    }
    // fill list
    tabsList.appendChild(currentTabs);
    return tabs;
};

function appendEmptyPlaceholder(currentTabs) {
    const newListElem = document.createElement('li');
    newListElem.textContent = "Nothing found...";
    currentTabs.appendChild(newListElem);
}