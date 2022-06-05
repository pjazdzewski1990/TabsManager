// holds functions related to obtaining and handling tab state

// get new tabs info
export function refreshTabsState() {
  return browser.tabs.query({currentWindow: true});
}