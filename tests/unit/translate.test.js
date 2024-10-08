import {AsyncTranslator} from '../../src/model/translator.js';

class TestI18N {
    detectLanguage(text) {
        let output = "fr";
        switch (text) {
            case 'jabłko':
                output = "pl";
                break;
            case 'Apfel':
                output = "de";
                break;
            default:
                output = "en";
         }
        return Promise.resolve({
            languages: [{language: output}, {language: "it"}]
        });
    }
}

test('return the language code or later, depending on the given state', () => {
    const i18N = new TestI18N();
    const state = new Map([
        ["site", "en"],
        ["strona", "pl"],
        ["Seite", "de"]
    ]);
    const translator = new AsyncTranslator(state, i18N);
    expect(translator.checkLanguageSync("site")).toEqual("en");
    expect(translator.checkLanguageSync("strona")).toEqual("pl");
    expect(translator.checkLanguageSync("lado")).toEqual("LATER");
});

test('i18n should be used to patch known texts', async () => {
    const i18N = new TestI18N();
    const state = new Map([
        ["manzana", "it"]
    ]);
    const translator = new AsyncTranslator(state, i18N);
    // query initial state twice, gives stable result
    expect(translator.checkLanguageSync("manzana")).toEqual("it");
    expect(translator.checkLanguageSync("manzana")).toEqual("it");
    // query new state
    expect(translator.checkLanguageSync("Apfel")).toEqual("LATER");
    // update is happenning in the background, so we should wait 
    await new Promise((r) => setTimeout(r, 100));
    expect(translator.checkLanguageSync("Apfel")).toEqual("de");
});
