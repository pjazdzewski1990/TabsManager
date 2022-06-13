import {FirefoxTabProvider, filterTabState} from './../../model';

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