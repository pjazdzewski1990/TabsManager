import {SameWordsTabRecommender} from '../../src/model/sameWordsTabRecommender.js';

//TODO: use dummy tab objects
// Note: order does matter as recommender takes the first one matching
const tabsUnderTest = [
    {title: "LondonTokyoChicago", url: ""}, // string is split by space, not characters
    {title: "Paris", url: ""},
    {title: "LONDON", url: ""},
    {title: "Athens London Tokyo Chicago", url: ""},
];

test('SameWordsTabRecommender(wordThreshold=1) finds similar tabs based on similarity of titles', () => {
    //given some tabs
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

test('SameWordsTabRecommender(wordThreshold=2) finds similar tabs based on similarity of titles', () => {
    //given some tabs
    //and recommender
    const recommenderFor2 = new SameWordsTabRecommender(2);
    //when we recommend we should get 1st elem as the query is too short - we return the first
    expect(recommenderFor2.recommend({title: "London"}, tabsUnderTest).title).toEqual("LondonTokyoChicago");
    //when we recommend we should get first tab that matches at least 2 words
    expect(recommenderFor2.recommend({title: "Chicago Tokyo"}, tabsUnderTest).title).toEqual("Athens London Tokyo Chicago");
    //when we recommend we should get first tab that matches at least 2 words - order doesn't matter
    expect(recommenderFor2.recommend({title: "Tokyo Chicago"}, tabsUnderTest).title).toEqual("Athens London Tokyo Chicago");
});

//TODO: find a way to test FF APIs as mocking everything is not viable in the the long run