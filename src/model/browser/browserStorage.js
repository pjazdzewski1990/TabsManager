export class FirefoxBrowserStorage {
    /**
     * Reads from browser storage
     * @returns {String} storageKey FF native list of open tabs
     */
    // eslint-disable-next-line class-methods-use-this
    read(storageKey) {
        // eslint-disable-next-line no-undef
        return browser.storage.local.get(storageKey);
    }

    /**
     * Stores given object in browser store
     * @returns {Object} forStorage FF native list of open tabs
     */
    // eslint-disable-next-line class-methods-use-this
    save(forStorage) {
        // eslint-disable-next-line no-undef
        return browser.storage.local.set(forStorage);
    }
}