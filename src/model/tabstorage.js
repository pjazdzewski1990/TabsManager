export class FirefoxTabStorage {
  fetchAllTabTranslations = 'all-tab-translations';

/**
  * Returns a Map from of tab titles to language codes, wrapped in a Promise
  * @returns {Promise<Map>} The stored, last closed, tab information
  */
  getAsync() {
    // eslint-disable-next-line no-undef
    const storedAsync = browser.storage.local.get(this.fetchAllTabTranslations);
    return storedAsync.then((storedState) => {
      console.log('Read tabs information', storedState);
      return storedState['all-tab-translations'];
    })
      .then((storedState) => {
        const state = (!storedState) ? new Map() : storedState;
        return state;
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
  * @param {Array<EnrichedTab>} capturedState
  * @returns {Promise} Handler that completes or failes with the update process
  */
  upsertAsync(capturedState) {
    return this.getAsync()
      .then((storedState) => this.#prepareStorageObject(storedState, capturedState))
      // eslint-disable-next-line no-undef
      .then((mergedState) => browser.storage.local.set(mergedState));
  }
}