export class FirefoxTabProvider {
  // get new tabs info
  // eslint-disable-next-line class-methods-use-this
  provide() {
    // eslint-disable-next-line no-undef
    return browser.tabs.query({ currentWindow: true });
  }
}