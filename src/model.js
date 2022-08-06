// holds functions related to obtaining and handling tab state

export class FirefoxTabProvider {
    // get new tabs info
    provide() {
        return browser.tabs.query({currentWindow: true});
    }
}

export class FirefoxTabStorage {
    fetchAllTabTranslations = "all-tab-translations";

    getAsync() {
        // returns an title -> language code map
        const storedAsync = browser.storage.local.get(this.fetchAllTabTranslations);
        return storedAsync.then(stored => {
            console.log("Read tabs information", stored);
            return stored["all-tab-translations"];
        })
    }

    upsertAsync(capturedState) {
        return this.getAsync()
            //we merge the 2 states, where the new one overwrites the existing one
            .then(storedState => new Map([...storedState, ...capturedState]))
            .then(mergedState => {
                const obj = {};
                obj[this.fetchAllTabTranslations] = mergedState;
                console.log("Upserting tabs information", obj);
                return obj;
            })
            .then(mergedState => browser.storage.local.set(mergedState));
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
        if(this.tabTextToLanguageMap.has(textToDetectLanguageFrom)) {
            return this.tabTextToLanguageMap.get(textToDetectLanguageFrom);
        } else {
            // start async process to update the cache
            const callback = (detectionObject) => {
                if(detectionObject.languages.length > 0) {
                    this.tabTextToLanguageMap.set(textToDetectLanguageFrom, detectionObject.languages[0].language);
                } else {
                    this.tabTextToLanguageMap.set(textToDetectLanguageFrom, "UNKNOWN");
                }
            };
            browser.i18n.detectLanguage(textToDetectLanguageFrom).then(lang => callback(lang));
            // return message for now
            return "LATER";
        };
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
        console.log("Enriching lang in " + tab.title + " => " + language);
        const enrichedTab = new EnrichedTab(tab.id, tab.title, tab.url, language);
        return enrichedTab;
    });
};

// turns and enriched tab into searchable string
function tabToSearchString(tab) {
    return (tab.title + " l:" + tab.languageCode).toLowerCase();
};

export function filterTabState(tabs, stringQuery) {
    // input like "foo   BAR" becomes a "foo|bar" regexp
    const searchExpression = stringQuery.toLowerCase().replace(/\s+/g, "|");

    return tabs.filter((tab) => {
        const searchContent = tabToSearchString(tab);
        const wasFound = new RegExp(searchExpression).test(searchContent);
        console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
        return wasFound;
    });
};