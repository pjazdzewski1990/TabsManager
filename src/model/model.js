const lastClosedTabStorageKey = 'lastClosedTab';

/**
 * Obtain the last closed tab from the browser storage
 * @returns {Object} The stored, last closed, tab information
 */
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}

/**
 * Turns the provided EnrichedTab into a searcheable string
 * @param {EnrichedTab} tab Tab info to be converted
 * @returns {string} A consistent, searcheable string
 */
function tabToSearchString(tab) {
  return (`${tab.title} l:${tab.languageCode}`).toLowerCase();
}

/**
 * Filters the provided tabs using the provides search query
 * @param {Array<EnrichedTab>} tabs Available list of tabs
 * @param {string} stringQuery User provided search query
 * @returns {Array<EnrichedTab>} Tab list filtered using the provided query
 */
export function filterTabState(tabs, stringQuery) {
  // input like "foo   BAR" becomes a "foo|bar" regexp
  const searchExpression = stringQuery.toLowerCase().replace(/\s+/g, '|');

  return tabs.filter((tab) => {
    const searchContent = tabToSearchString(tab);
    const wasFound = new RegExp(searchExpression).test(searchContent);
    // console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
    return wasFound;
  });
}
