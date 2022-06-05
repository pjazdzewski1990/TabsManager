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

// get new tabs info
export function refreshTabsState() {
  return browser.tabs.query({currentWindow: true}).then(tabs => {
    return tabs.map(tab => {
        return new Tab(tab.id, tab.title, tab.url);
    });
  });
};