import {FirefoxTabStorage} from '../../src/model/tabStorage.js';

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
    const tabs = new FirefoxTabStorage(storage);
    const resultP = tabs.getAsync();
    return resultP.then((result) => {
        expect(result).toEqual(new Map());
    });
});

test('should read empty if storage did fail', () => {
    const failure = Promise.reject(new Error('boom'));
    const storage = new TestBrowserStorage(failure);
    const tabs = new FirefoxTabStorage(storage);
    const resultP = tabs.getAsync();
    return resultP.then((result) => {
        expect(result).toEqual(new Map());
    });
});

// test('should read set if given one before', () => {
//     //given some tabs
//     const tabsUnderTest = [
//         {id: 1, title: "Blockchain Technology Explained (2 Hour Course)", url: ""},
//         {id: 2, title: "مقروط على طريقة جلاب جامون", url: ""},
//         {id: 3, title: "Portugal: Zerstörung eines Dorfes für Lithium? | ARTE Reportage", url: ""},
//         {id: 4, title: "Dlaczego INFLACJA wciąż ROŚNIE? Początek Problemów #BizON", url: ""},
//     ];
//     const translator = new TestTranslator();
//     //when we translate
//     const result = enrichTabState(tabsUnderTest, translator);
//     //then we expect the results to be assigned titles
//     expect(result.length).toEqual(4);
//     expect(result.map(t => [t.id, t.languageCode])).toEqual([
//         [1, "en"],
//         [2, "ma"],
//         [3, "de"],
//         [4, "pl"]
//     ]);
// });

// test('should overwrite old keys if needed', () => {
//     //given some tabs
//     const tabsUnderTest = [
//         {id: 1, title: "Blockchain Technology Explained (2 Hour Course)", url: ""},
//         {id: 2, title: "مقروط على طريقة جلاب جامون", url: ""},
//         {id: 3, title: "Portugal: Zerstörung eines Dorfes für Lithium? | ARTE Reportage", url: ""},
//         {id: 4, title: "Dlaczego INFLACJA wciąż ROŚNIE? Początek Problemów #BizON", url: ""},
//     ];
//     const translator = new TestTranslator();
//     //when we translate
//     const result = enrichTabState(tabsUnderTest, translator);
//     //then we expect the results to be assigned titles
//     expect(result.length).toEqual(4);
//     expect(result.map(t => [t.id, t.languageCode])).toEqual([
//         [1, "en"],
//         [2, "ma"],
//         [3, "de"],
//         [4, "pl"]
//     ]);
// });

// test('should read set if given one before - respecting an upper bound', () => {
//     //given some tabs
//     const tabsUnderTest = [
//         {id: 1, title: "Blockchain Technology Explained (2 Hour Course)", url: ""},
//         {id: 2, title: "مقروط على طريقة جلاب جامون", url: ""},
//         {id: 3, title: "Portugal: Zerstörung eines Dorfes für Lithium? | ARTE Reportage", url: ""},
//         {id: 4, title: "Dlaczego INFLACJA wciąż ROŚNIE? Początek Problemów #BizON", url: ""},
//     ];
//     const translator = new TestTranslator();
//     //when we translate
//     const result = enrichTabState(tabsUnderTest, translator);
//     //then we expect the results to be assigned titles
//     expect(result.length).toEqual(4);
//     expect(result.map(t => [t.id, t.languageCode])).toEqual([
//         [1, "en"],
//         [2, "ma"],
//         [3, "de"],
//         [4, "pl"]
//     ]);
// });