import {TabStorage} from '../../src/model/tabStorage.js';

// replacement for FirefoxBrowserStorage
class TestBrowserStorage {
    constructor(initialStorageP) {
        this.storage = initialStorageP || Promise.resolve({});
    }

    read(storageKey) {
        return this.storage;
    }
    save(forStorage) {
        this.storage = Promise.resolve(forStorage);
        return this.storage;
    }
}

test('should read empty set if no storage is set', () => {
    const storage = new TestBrowserStorage();
    const tabs = new TabStorage(storage);
    const resultP = tabs.getAsync();
    return resultP.then((result) => {
        expect(result).toEqual(new Map());
    });
});

test('should read empty if storage did fail', () => {
    const failure = Promise.reject(new Error('boom'));
    const storage = new TestBrowserStorage(failure);
    const tabs = new TabStorage(storage);
    const resultP = tabs.getAsync();
    return resultP.then((result) => {
        expect(result).toEqual(new Map());
    });
});

test('should read set if given one before', () => {
    const input = new Map([
        ["site", "en"],
        ["strona", "pl"],
        ["Seite", "de"]
    ]);
    const failure = Promise.resolve({'all-tab-translations': input});
    const storage = new TestBrowserStorage(failure);
    const tabs = new TabStorage(storage);
    const resultP = tabs.getAsync();
    return resultP.then((result) => {
        expect(result).toEqual(input);
    });
});

test('should overwrite old keys if needed', () => {
    const input1 = new Map([
        ["site", "en"],
        ["strona", "??"],
        ["Seite", "??"]
    ]);
    const input2 = new Map([
        ["strona", "pl"]
    ]);
    const input3 = new Map([
        ["site", "en"],
        ["Seite", "de"]
    ]);
    const expected = new Map([
        ["site", "en"],
        // this one is missing as the last update did remove it
        // ["strona", "pl"],
        ["Seite", "de"]
    ]);
    const failure = Promise.resolve({'all-tab-translations': input1});
    const storage = new TestBrowserStorage(failure);
    const tabs = new TabStorage(storage);
    const resultP = tabs.upsertAsync(input2).then((_) => tabs.upsertAsync(input3));
    return resultP.then((result) => {
        expect(result).toEqual(expected);
    });
});
