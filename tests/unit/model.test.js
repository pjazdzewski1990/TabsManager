import {enrichTabState} from './../../src/model/enrichedTab.js';
import {FirefoxTabProvider} from './../../src/model/tabprovider.js';
import {SameWordsTabRecommender} from './../../src/model/tabrecommender.js';
import {filterTabState} from './../../src/model/model.js';

class TestTabProvider {
    constructor(_tabs) {
        this.tabs = _tabs;
    }
    provide() {
        return Promise.resolve(this.tabs);
    }
}

test('filters tabs based on the title', () => {
    //given some tabs
    const tabsUnderTest = [
        {id: 1, title: "Test1", url: "http://example.com/1"},
        {id: 2, title: "TEST 2", url: "http://example.com/2"},
        {id: 3, title: "test 3", url: "http://example.com/3"},
        {id: 4, title: "  Test4", url: "http://example.com/4"},
        {id: 5, title: "Foo", url: "http://example.com/foo"},
        {id: 6, title: "Bar", url: "http://example.com/bar"}
    ];
    const provider = new TestTabProvider(tabsUnderTest);
    //when we filter by Test
    const resultPromise = provider.provide().then(tabs => filterTabState(tabs, "Test"));
    //then we expect the results to be filtered by title
    return resultPromise.then(result => {
        expect(result.length).toEqual(4);
        expect(result.map(t => t.id)).toEqual([1,2,3,4]);
    });
});

// dummy translator for testing
class TestTranslator {
    checkLanguageSync(text) {
        const normalizedText = text.toLowerCase();
        if(normalizedText.indexOf("ś") > 0) {
            return "pl";
        } else if(normalizedText.indexOf("ö") > 0) {
            return "de";
        } else if(normalizedText.indexOf("ن") > 0) {
            return "ma";
        } else {
            return "en";
        }
    }
}

test('detect language in tabs', () => {
    //given some tabs
    const tabsUnderTest = [
        {id: 1, title: "Blockchain Technology Explained (2 Hour Course)", url: ""},
        {id: 2, title: "مقروط على طريقة جلاب جامون", url: ""},
        {id: 3, title: "Portugal: Zerstörung eines Dorfes für Lithium? | ARTE Reportage", url: ""},
        {id: 4, title: "Dlaczego INFLACJA wciąż ROŚNIE? Początek Problemów #BizON", url: ""},
    ];
    const translator = new TestTranslator();
    //when we translate
    const result = enrichTabState(tabsUnderTest, translator);
    //then we expect the results to be assigned titles
    expect(result.length).toEqual(4);
    expect(result.map(t => [t.id, t.languageCode])).toEqual([
        [1, "en"],
        [2, "ma"],
        [3, "de"],
        [4, "pl"]
    ]);
});

test('SameWordsTabRecommender(wordThreshold=1) finds similar tabs based on similarity of titles', () => {
    //given some tabs
    const tabsUnderTest = [
        {id: 4, title: "LondonTokyoChicago", url: ""}, // string is split by space, not characters
        {id: 1, title: "Paris", url: ""},
        {id: 2, title: "LONDON", url: ""},
        {id: 3, title: "Athens London Tokyo Chicago", url: ""},
    ];
    //and recommender
    const recommenderFor1 = new SameWordsTabRecommender(1);
    //when we recommend we should get a similar tab
    expect(recommenderFor1.recommend({title: "Tokyo"}, tabsUnderTest).title).toEqual("Athens London Tokyo Chicago");
    // ignore case
    expect(recommenderFor1.recommend({title: "London"}, tabsUnderTest).title).toEqual("LONDON");
    // return first element if nothing is found
    expect(recommenderFor1.recommend({title: "Cairo"}, tabsUnderTest).title).toEqual("LondonTokyoChicago");
    // return first element if no reference is provided
    expect(recommenderFor1.recommend(undefined, tabsUnderTest).title).toEqual("LondonTokyoChicago");
    // return nothing if no data is provided
    expect(recommenderFor1.recommend({title: "Cairo"}, [])).toEqual(undefined);
});

test('SameWordsTabRecommender(wordThreshold=1) finds similar tabs based on similarity of titles', () => {
    //given some tabs
    const tabsUnderTest = [
        {id: 1, title: "Paris", url: ""},
        {id: 4, title: "LondonTokyoChicago", url: ""}, // string is split by space, not characters
        {id: 2, title: "LONDON", url: ""},
        {id: 3, title: "Athens London Tokyo Chicago", url: ""},
    ];
    //and recommender
    const recommenderFor2 = new SameWordsTabRecommender(2);
    //when we recommend we should get 1st elem as the query is too short
    expect(recommenderFor2.recommend({title: "London"}, tabsUnderTest).title).toEqual("Paris");
    //when we recommend we should get first tab that matches at least 2 words
    expect(recommenderFor2.recommend({title: "Chicago Tokyo"}, tabsUnderTest).title).toEqual("Athens London Tokyo Chicago");
});

//TODO: find a way to test FF APIs as mocking everything is not viable in the the long run