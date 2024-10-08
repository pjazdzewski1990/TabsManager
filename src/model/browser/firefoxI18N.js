export class FirefoxI18N {
    /**
     * Detect the language used in the provided text
     * @returns {Promise<String>} ISO code of the language (2 characters)
     */
    // eslint-disable-next-line class-methods-use-this
    detectLanguage(text) {
        // eslint-disable-next-line no-undef
        return browser.i18n.detectLanguage(text);
    }
}