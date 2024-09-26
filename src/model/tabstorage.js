import {FirefoxBrowserStorage} from './browserStorage.js';

export class FirefoxTabStorage {
  fetchAllTabTranslations = 'all-tab-translations';

  constructor(storage, storageUpperBound) {
    // don't store more elements that this.storageUpperBound
    this.storageUpperBound = storageUpperBound || 500;
    this.storage = storage || new FirefoxBrowserStorage();
  }

 /**
  * Returns a Map from of tab titles to language codes, wrapped in a Promise
  * @returns {Promise<Map>} The stored, last closed, tab information
  */
  getAsync() {
    // eslint-disable-next-line no-undef
    return this.storage
      .read(this.fetchAllTabTranslations)
      .then((storedState) => {
        if(!storedState || !storedState[this.fetchAllTabTranslations]) {
          console.log('Returning empty translation list');
          return new Map();
        } else { 
          const storedTabs = storedState[this.fetchAllTabTranslations];
          console.log('Reading tabs information #' + storedTabs.size, storedTabs.entries().next().value);
          return storedTabs;
        }
      })
      .catch(error => {
        console.log('Tab read failed', error);
        // in case of a failure to access the storage we will just save the data later
        return new Map();
      });
  }

  /**
   * Wrap the captured data into an object for storage
   * @param {Map} capturedState 
   * @returns {Object} The stored state is returned back
   */
  #prepareStorageObject(capturedState) {
    const mergedState = new Map([...capturedState]);
    const wrapperForStorage = {};
    wrapperForStorage[this.fetchAllTabTranslations] = mergedState;
    console.log('Upserting tabs information #' + mergedState.size, mergedState.entries().next().value);

    return wrapperForStorage;
  }

/**
  * Given the current state, merges it with the old data and updates the storage
  * @param {Array<EnrichedTab>} capturedState Previous known state
  * @returns {Promise} Handler that completes or failes with the update process
  */
  upsertAsync(capturedState) {
    const capturedStateForStorage = this.#prepareStorageObject(capturedState);
    return this.storage
      .save(capturedStateForStorage)
      .then((_) => capturedStateForStorage[this.fetchAllTabTranslations]);
  }
}