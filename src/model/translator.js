export class FirefoxAsyncTranslator {
  // stores an title -> language code map
  tabTextToLanguageMap;

  constructor(storedState) {
    this.tabTextToLanguageMap = storedState;
  }

  // given a text returns the language code, say: "Hello World" => "en"
  // returns the value immediately, without blocking
  // returns "UNKNOWN" if cannot detect the language
  // returns "LATER" if the detection process was started and the user should try again later
/**
  * Given text, immediately returns:
  * - a language code for known texts, say: "Hello World" => "en"
  * - "UNKNOWN" if we cannot detect the language
  * - "LATER" if the user should ask again in a moment
  * The immediate return allows us to generate the UI without waiting
  * @param {string} textToDetectLanguageFrom Text for which we should detect the language
  * @returns {string} Either the language code or one of the 2 special codes
  */
  checkLanguageSync(textToDetectLanguageFrom) {
    if (this.tabTextToLanguageMap.has(textToDetectLanguageFrom)) {
      return this.tabTextToLanguageMap.get(textToDetectLanguageFrom);
    }
    //TODO: move this to its own function
    // start async process to update the cache
    const callback = (detectionObject) => {
      if (detectionObject.languages.length > 0) {
        this.tabTextToLanguageMap.set(
          textToDetectLanguageFrom,
          detectionObject.languages[0].language,
        );
      } else {
        this.tabTextToLanguageMap.set(textToDetectLanguageFrom, 'UNKNOWN');
      }
    };
    // eslint-disable-next-line no-undef
    browser.i18n.detectLanguage(textToDetectLanguageFrom).then((lang) => callback(lang));
    // return message for now
    return 'LATER';
  }
}