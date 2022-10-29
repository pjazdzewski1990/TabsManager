

const lastClosedTabStorageKey = 'lastClosedTab';
export function getLastClosedTabAsync() {
  // eslint-disable-next-line no-undef
  return browser.storage.local.get(lastClosedTabStorageKey);
}

// this impl prefers simple, fast heuristic:
// go over the meaningful words and pick the one that has at least "wordThreshold" same words
export class SameWordsTabRecommender {
  constructor(wordThreshold) {
    this.wordThreshold = wordThreshold;
  }

  // eslint-disable-next-line class-methods-use-this
  #normalizeString(str) {
    const safeString = str || '';
    return safeString.trim().split(/[^A-Za-z]/).filter((it) => it.length > 3).map((it) => it.toLowerCase());
  }

  // from the given tabs selects one that is most similar to the one given
  recommend(similarTo, all) {
    console.log('recommend(similarTo, all)', similarTo);
    console.log('recommend(similarTo, all)', all);
    if (similarTo) {
      const similarToWords = this.#normalizeString(similarTo.title);
      const similar = all.find((tab) => {
        const tabWords = this.#normalizeString(tab.title);
        const overlap = similarToWords.filter((val) => tabWords.indexOf(val) !== -1);
        console.log(`${similarTo.title} <==> ${tab.title}`, overlap);
        // end if we found enough words
        return overlap.length >= this.wordThreshold;
      });
      return similar || all[0];
    }
    // return anything if undefined or there's not match
    return all[0];
  }
}

export class FirefoxAsyncTranslator {
  // stores an title -> language code map
  tabTextToLanguageMap;

  constructor(storedState) {
    this.tabTextToLanguageMap = storedState;
  }

  // given a text returns the language code, say: "Hello World" => "en"
  // returns the value immediately, without blocking
  // returns "UNKNOWN" if cannot detect the language
  // returns "LATER" if the detection process was started and the user should try again later
  checkLanguageSync(textToDetectLanguageFrom) {
    if (this.tabTextToLanguageMap.has(textToDetectLanguageFrom)) {
      return this.tabTextToLanguageMap.get(textToDetectLanguageFrom);
    }
    // start async process to update the cache
    const callback = (detectionObject) => {
      if (detectionObject.languages.length > 0) {
        this.tabTextToLanguageMap.set(
          textToDetectLanguageFrom,
          detectionObject.languages[0].language,
        );
      } else {
        this.tabTextToLanguageMap.set(textToDetectLanguageFrom, 'UNKNOWN');
      }
    };
    // eslint-disable-next-line no-undef
    browser.i18n.detectLanguage(textToDetectLanguageFrom).then((lang) => callback(lang));
    // return message for now
    return 'LATER';
  }
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
