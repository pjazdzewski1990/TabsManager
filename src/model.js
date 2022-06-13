// holds functions related to obtaining and handling tab state

// domain specific wrapper around https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
class Tab {
    id;
    title;
    url;

    constructor(id, title, url) {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}

export class FirefoxTabProvider {
    // get new tabs info
    provide() {
        return browser.tabs.query({currentWindow: true}).then(tabs => {
            return tabs.map(tab => {
                return new Tab(tab.id, tab.title, tab.url);
            });
          });
    }
}

export function filterTabState(tabs, stringQuery) {
    // input like "foo   BAR" becomes a "foo|bar" regexp
    const searchExpression = stringQuery.toLowerCase().replace(/\s+/g, "|");

    return tabs.filter((tab) => {
        const searchContent = (tab.title).toLowerCase();
        const wasFound = new RegExp(searchExpression).test(searchContent);
        console.log("Testing " + searchContent + " for " + searchExpression + " => " + wasFound);
        return wasFound;
    });
};