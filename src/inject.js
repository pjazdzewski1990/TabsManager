/* eslint-disable import/extensions */
import { FirefoxTabProvider } from './model/browser/firefoxTabProvider.js';
import { TabStorage } from './model/tabStorage.js';
import { SameWordsTabRecommender } from './model/sameWordsTabRecommender.js';
import { AsyncTranslator } from './model/asyncTranslator.js';

function buildTranslatorAsync(storage) {
  return storage
    .getAsync()
    .then((tabsData) => new AsyncTranslator(tabsData));
}

/**
 * @returns {Object} Container holding various services used by the addon
 */
/* eslint-disable import/prefer-default-export */
export function injectServices() {
  const tabsProvider = new FirefoxTabProvider();
  const storedTabsStateP = tabsProvider.provide();
  const storage = new TabStorage();
  const tabsTranslatorP = buildTranslatorAsync(storage);

  const tabsRecommender = new SameWordsTabRecommender(2);

  return {
    storedTabsStateP,
    storage,
    tabsTranslatorP,
    tabsRecommender,
  };
}
