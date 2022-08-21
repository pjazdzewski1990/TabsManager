// manage the badge UI
function updateCount(tabId, isOnRemoved) {
  return browser.tabs.query({})
      .then((tabs) => {
        let length = tabs.length;

        // onRemoved fires too early and the count is one too many.
        // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
        if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
          length--;
        }

        browser.browserAction.setBadgeText({text: length.toString()});
        browser.browserAction.setBadgeBackgroundColor({'color': 'yellow'});
      });
}


browser.tabs.onRemoved.addListener((tabId) => {
    console.log(`The tab with id: ${tabId}, is closing`);
    updateCount(tabId, true);
});
browser.tabs.onCreated.addListener((tabId) => {
    updateCount(tabId, true);
});

updateCount();