// functions to handle UI updates

export function clearList(listElem) {
  while (listElem.firstChild) {
    listElem.removeChild(listElem.lastChild);
  }
}

// builds an Html from a language code (and special values that we use)
function createLanguageIconHtml(languageCode) {
  const langIcon = document.createElement('img');
  langIcon.alt = languageCode;
  // in case of trouble translating - assume en
  // kudos to https://anandchowdhary.github.io/language-icons/
  // and https://flagicons.lipis.dev/
  let langLink = (`https://unpkg.com/language-icons/icons/${languageCode}.svg`);
  if (languageCode.toLowerCase() === 'later') {
    langLink = 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/1x1/un.svg';
  }
  if (languageCode.toLowerCase() === 'unknown') {
    langLink = 'https://raw.githubusercontent.com/lipis/flag-icons/main/flags/1x1/xx.svg';
  }
  langIcon.src = langLink;
  langIcon.classList.add('lang-icon');
  return langIcon;
}

export function listTabs(tabs) {
  const tabsList = document.getElementById('tabs-list');
  // clear list
  clearList(tabsList);
  // prepare elements
  const currentTabs = document.createDocumentFragment();
  for (const tab of tabs) {
    const langIcon = createLanguageIconHtml(tab.languageCode);

    const tabLink = document.createElement('a');
    tabLink.textContent = (`#${tab.id} ${tab.title}`);
    tabLink.setAttribute('href', tab.id);
    tabLink.classList.add('switch-tabs');

    const newListElem = document.createElement('li');
    newListElem.appendChild(langIcon);
    newListElem.appendChild(tabLink);
    currentTabs.appendChild(newListElem);
  }
  // .. or a placeholder if empty
  if (tabs.length === 0) {
    appendEmptyPlaceholder(currentTabs);
  }
  // fill list
  tabsList.appendChild(currentTabs);
  return tabs;
}

export function showSimilarTab(tab) {
  console.log('showSimilarTab', tab);
  const tabsElem = document.getElementById('similar-tab');
  // clear list
  clearList(tabsElem);

  const tabLink = document.createElement('a');
  tabLink.textContent = (`#${tab.id} ${tab.title}`);
  tabLink.setAttribute('href', tab.id);
  tabLink.classList.add('switch-tabs');

  // fill list
  tabsElem.appendChild(tabLink);
  return tab;
}

function appendEmptyPlaceholder(currentTabs) {
  const newListElem = document.createElement('li');
  newListElem.textContent = 'Nothing found...';
  currentTabs.appendChild(newListElem);
}
