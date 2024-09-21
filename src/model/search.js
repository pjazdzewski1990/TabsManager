/**
 * Given a string input alignes the case and spaces
 * @param {String} str String to normalize
 * @returns Normalized value that can be reliably used in search
 */
function normalizeStringForSearch(str) {
    return str.toLowerCase().trim();
}

/**
 * Turns the provided EnrichedTab into a searcheable string
 * @param {EnrichedTab} tab Tab info to be converted
 * @returns {string} A consistent, searcheable string
 */
function tabToSearchString(tab) {
  return (`${tab.title} l:${normalizeStringForSearch(tab.languageCode)}`).toLowerCase();
}

/**
 * Filters the provided tabs using the provides search query
 * @param {Array<EnrichedTab>} tabs Available list of tabs
 * @param {string} stringQuery User provided search query
 * @returns {Array<EnrichedTab>} Tab list filtered using the provided query
 */
export function filterTabState(tabs, stringQuery) {
  // input like "foo   BAR" becomes a "foo|bar" regexp
  const searchExpression = normalizeStringForSearch(stringQuery).replace(/\s+/g, '|');

  return tabs.filter((tab) => {
    const searchContent = tabToSearchString(tab);
    const wasFound = new RegExp(searchExpression).test(searchContent);
    // console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
    return wasFound;
  });
}
