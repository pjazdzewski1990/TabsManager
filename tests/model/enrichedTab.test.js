import {enrichTabState} from '../../src/model/enrichedTab.js';

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