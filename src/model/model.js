const lastClosedTabStorageKey = 'lastClosedTab';
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}

// turns and enriched tab into searchable string
function tabToSearchString(tab) {
  return (`${tab.title} l:${tab.languageCode}`).toLowerCase();
}

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
