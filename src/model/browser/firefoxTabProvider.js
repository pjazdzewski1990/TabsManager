export class FirefoxTabProvider {
  /**
   * Returns a list of tabs open
   * @returns {Array<Object>} FF native list of open tabs
   */
  // eslint-disable-next-line class-methods-use-this
  provide() {
    // eslint-disable-next-line no-undef
    return browser.tabs.query({ currentWindow: true });
  }
}