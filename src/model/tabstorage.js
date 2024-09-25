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
          const stored = storedState[this.fetchAllTabTranslations];
          return stored;
        }
      })
      .catch(error => {
        console.log('Tab read failed', error);
        // in case of a failure to access the storage we will just save the data later
        return new Map();
      });
  }

  /**
   * We take the pre-existing stored data and the new data,
   * merge them together
   * wrap in an object for save storage by placing it as an object key
   * return that object back to the caller
   * @param {Map} storedState 
   * @param {Map} capturedState 
   * @returns {Object} The stored state is returned back
   */
  #prepareStorageObject(storedState, capturedState) {
    // TODO: should there be an upper bound on the pages count?
    const mergedState = new Map([...storedState, ...capturedState]);
    const wrapperForStorage = {};
    wrapperForStorage[this.fetchAllTabTranslations] = mergedState;
    console.log('Upserting tabs information #' + mergedState.size, mergedState.entries().next().value);

    //TODO: drop the last X elements from stored state to make room for captured state
    // const debug = Array.from({length: 10}, function(){ return this.next().value; }, mergedState.entries());
    // console.log('debug', debug);

    return wrapperForStorage;
  }

/**
  * Given the current state, merges it with the old data and updates the storage
  * @param {Array<EnrichedTab>} capturedState Previous known state
  * @returns {Promise} Handler that completes or failes with the update process
  */
  upsertAsync(capturedState) {
    return this.getAsync()
      .then((storedState) => this.#prepareStorageObject(storedState, capturedState))
      // eslint-disable-next-line no-undef
      .then((mergedState) => this.storage.save(mergedState));
  }
}