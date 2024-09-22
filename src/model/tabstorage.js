export class FirefoxTabStorage {
  fetchAllTabTranslations = 'all-tab-translations';

/**
  * Returns a Map from of tab titles to language codes, wrapped in a Promise
  * @returns {Promise<Map>} The stored, last closed, tab information
  */
  getAsync() {
    // eslint-disable-next-line no-undef
    return browser.storage.local
      .get(this.fetchAllTabTranslations)
      .then((storedState) => {
        if(!storedState || !storedState[this.fetchAllTabTranslations]) {
          console.log('Returning empty translation list');
          return new Map();
        } else { 
          const stored = storedState[this.fetchAllTabTranslations];
          // it's already stored as Map, so no need to convert
          return stored;
        }
      })
      .then((storedState2) => {
        return storedState2;
      });
  }

  // we merge the 2 states, where the new one overwrites the existing one
  #prepareStorageObject(storedState, capturedState) {
    // TODO: should there be an upper bound on the pages count?
    const mergedState = new Map([...storedState, ...capturedState]);
    const obj = {};
    obj[this.fetchAllTabTranslations] = mergedState;
    console.log('Upserting tabs information', obj);
    return obj;
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
      .then((mergedState) => browser.storage.local.set(mergedState));
  }
}