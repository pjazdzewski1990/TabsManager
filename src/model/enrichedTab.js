/**
 * Domain specific wrapper around https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
 * with additional data appended for the plugin to use
 */
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

/**
 * Enriches raw tab information with:
 * - language uses 
 * @param {array<>} tabs List of tab information
 * @param {AsyncTranslator} translator Service to use for language detection
 * @returns {Array<EnrichedTab>} Input array converted to EnrichedTab
 */
export function enrichTabState(tabs, translator) {
  return tabs.map((tab) => {
    const language = translator.checkLanguageSync(tab.title);
    // console.log("Enriching lang in " + tab.title + " => " + language);
    const enrichedTab = new EnrichedTab(tab.id, tab.title, tab.url, language);
    return enrichedTab;
  });
}