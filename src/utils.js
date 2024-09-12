// generic tools

/**
 * Pause execution for "wait" millis, then execute callback
 * when called N times will trigger just once after the last wait period
 * @param {Function} callback Code to run after the wait timeout 
 * @param {number} wait How long should we wait before running the callback
 * @returns {Function} Handler to run the callback with the debounce semantics
 */
export function debounce(callback, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
}

/**
 * Switches the user to selected tab id
 * @param {number} tabId Id of the tab that is recognized by FF
 */
export function navigateToTabId(tabId) {
  console.log('Navigating to tab', tabId);
  // eslint-disable-next-line no-undef
  browser.tabs.update(tabId, { active: true });
}

/**
 * Returns a promise that completes after given amount if milliseconds
 * @param {number} milliSecondDelay Count of milliseconds after which the promise should resolve
 * @returns {Promise<number>}
 */
export function runAfterDelay(milliSecondDelay) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliSecondDelay);
  });
}
