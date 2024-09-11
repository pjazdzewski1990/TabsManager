// functions to handle UI updates

/**
 * Goes over the provided lsit element and clears it
 * @param {HTMLElement} listElem Htlm li element to be cleared
 */
export function clearList(listElem) {
  while (listElem.firstChild) {
    listElem.removeChild(listElem.lastChild);
  }
}

/**
 * Builds an Html <img> tag to represent the language code provided
 * @param {String} languageCode ISO language code to be used (say: en, pl, fr) or 'later' (if identification is in progress) or 'unknown' (if identification process failed)
 * @returns {HTMLElement} Img tag representing a language code
 */
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

/**
 * Given the html tab list element, appends a placeholder value
 * @param {HTMLElement} currentTabs Parent element to which 
 */
function appendEmptyPlaceholder(currentTabs) {
  const newListElem = document.createElement('li');
  newListElem.textContent = 'Nothing found...';
  currentTabs.appendChild(newListElem);
}

/**
 * Given a list of tab objects refreshes the HTML node with id 'tabs-list'
 * @param {Array<EnrichedTab>} tabs Objects representing the tabs to be shown
 * @returns {Array<EnrichedTab>} Returns the input array back, without any modification
 */
export function listTabs(tabs) {
  const tabsList = document.getElementById('tabs-list');//TODO: is not pure
  // clear list
  clearList(tabsList);
  // prepare elements
  const currentTabs = document.createDocumentFragment();
  tabs.forEach((tab) => {
    const langIcon = createLanguageIconHtml(tab.languageCode);

    const tabLink = document.createElement('a');
    tabLink.textContent = (`#${tab.id} ${tab.title}`);
    tabLink.setAttribute('href', tab.id);
    tabLink.classList.add('switch-tabs');

    const newListElem = document.createElement('li');
    newListElem.appendChild(langIcon);
    newListElem.appendChild(tabLink);
    currentTabs.appendChild(newListElem);
  });
  // .. or a placeholder if empty
  if (tabs.length === 0) {
    appendEmptyPlaceholder(currentTabs);
  }
  // fill list
  tabsList.appendChild(currentTabs);
  return tabs;
}

/**
 * Given a single tab, updates the HTML node with id 'similar-tab' to point towards that tab
 * @param {Array<EnrichedTab>} tabs Objects representing the tabs to be shown
 * @returns {Array<EnrichedTab>} Returns the input array back, without any modification
 */
export function showSimilarTab(tab) {
  console.log('showSimilarTab element:', tab);
  const tabsElem = document.getElementById('similar-tab');//TODO: is not pure
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
