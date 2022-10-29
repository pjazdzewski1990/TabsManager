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