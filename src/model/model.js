

const lastClosedTabStorageKey = 'lastClosedTab';
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}

// domain specific wrapper around https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
// with additional data appended for the plugin to use
class EnrichedTab {
  id;

  title;

  url;

  languageCode;

  constructor(id, title, url, languageCode) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.languageCode = languageCode;
  }
}

// takes raw tabs information and enriches it with additional information like:
// - language used
export function enrichTabState(tabs, translator) {
  return tabs.map((tab) => {
    const language = translator.checkLanguageSync(tab.title);
    //        console.log("Enriching lang in " + tab.title + " => " + language);
    const enrichedTab = new EnrichedTab(tab.id, tab.title, tab.url, language);
    return enrichedTab;
  });
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
