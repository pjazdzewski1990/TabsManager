//TODO: handle warning
import {FirefoxI18N} from './browser/firefoxI18N.js';

export class AsyncTranslator {
  
  constructor(storedState, i18N) {
    // stores an title -> language code map
    this.tabTextToLanguageMap = storedState;
    this.i81n = i18N || new FirefoxI18N();
  }

  // start async process to update the cache
  #updateTextToLanguageMap(textToDetectLanguageFrom, detectionObject) {
    if (detectionObject.languages.length > 0) {
      this.tabTextToLanguageMap.set(
        textToDetectLanguageFrom,
        detectionObject.languages[0].language,
      );
    } else {
      this.tabTextToLanguageMap.set(textToDetectLanguageFrom, 'UNKNOWN');
    }
  }

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
  
    this.i81n.detectLanguage(textToDetectLanguageFrom)
      .then((detectionObject) => this.#updateTextToLanguageMap(textToDetectLanguageFrom, detectionObject));
    // return message for now
    return 'LATER';
  }
}