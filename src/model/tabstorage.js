export class FirefoxTabStorage {
  fetchAllTabTranslations = 'all-tab-translations';

  getAsync() {
    // returns an title -> language code map
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
    const mergedState = new Map([...storedState, ...capturedState]);
    const obj = {};
    obj[this.fetchAllTabTranslations] = mergedState;
    console.log('Upserting tabs information', obj);
    return obj;
  }

  upsertAsync(capturedState) {
    // TODO: should there be an upper bound on the pages count?
    return this.getAsync()
      .then((storedState) => this.#prepareStorageObject(storedState, capturedState))
      // TODO: we don't need all the keys if we would flatten???
      // eslint-disable-next-line no-undef
      .then((mergedState) => browser.storage.local.set(mergedState));
  }
}