// generic tools

// pause execution for "wait" millis, then execute callback
// when called N times will trigger just once after the last wait period
export function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
};


export function navigateToTabId(tabId) {
    console.log("Navigating to tab", tabId);
    browser.tabs.update(tabId, { active: true  });
};

export function runAfterDelay(milliSecondDelay) {
  return new Promise(resolve => {
    window.setTimeout(resolve, milliSecondDelay);
  });
}