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
  checkLanguageSync(textToDetectLanguageFrom) {
    if (this.tabTextToLanguageMap.has(textToDetectLanguageFrom)) {
      return this.tabTextToLanguageMap.get(textToDetectLanguageFrom);
    }
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