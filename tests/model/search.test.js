import {filterTabState} from '../../src/model/search.js';

class TestTabProvider {
    constructor(_tabs) {
        this.tabs = _tabs;
    }
    provide() {
        return Promise.resolve(this.tabs);
    }
}

const tabsUnderTest = [
    {id: 1, title: "Test1", languageCode: "en", url: "http://example.com/1"},
    {id: 2, title: "TEST 2", languageCode: "de",  url: "http://example.com/2"},
    {id: 3, title: "test 3", languageCode: "es",  url: "http://example.com/3"},
    {id: 4, title: "  Test4 ", languageCode: " EN ",  url: "http://example.com/4"},
    {id: 5, title: "  Testtttt 5", languageCode: " EN ",  url: "http://example.com/4"},
    {id: 10, title: "Foo", languageCode: "en",  url: "http://example.com/foo"},
    {id: 11, title: "Bar", languageCode: "pl",  url: "http://example.com/bar"}
];

test('filters tabs based on the title', () => {
    //given some tabs
    //when we filter by Test
    const result = filterTabState(tabsUnderTest, "Test");
    //then we expect the results to be filtered by title
    const expected = [1,2,3,4,5];
    return expect(result.map(t => t.id)).toEqual(expected);
});

test('filters tabs based on the title and language code', () => {
    //given some tabs
    //when we filter by: Test OR language is pl
    const result = filterTabState(tabsUnderTest, "l:pl");
    //then we expect the results to be filtered by language
    const expected = [11];
    return expect(result.map(t => t.id)).toEqual(expected);
});

test('filters tabs based on the title and language code', () => {
    //given some tabs
    //when we filter by: Foo OR language is en 
    const result = filterTabState(tabsUnderTest, "Foo l:en");
    //then we expect the results to be filtered
    const expected = [1,4,5,10];
    return expect(result.map(t => t.id)).toEqual(expected);
});