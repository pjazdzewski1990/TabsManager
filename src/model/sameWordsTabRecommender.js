import {urlToShortUrl} from '../../src/utils.js';

// this impl prefers simple, fast heuristic:
// go over the meaningful words and pick the one that has at least "wordThreshold" same words
export class SameWordsTabRecommender {
  constructor(wordThreshold) {
    this.wordThreshold = wordThreshold;
  }

  // eslint-disable-next-line class-methods-use-this
  #normalizeString(str) {
    const safeString = str || '';
    return safeString
      .trim()
      .split(/[^A-Za-z]/)
      .filter((it) => it.length > 3)
      .map((it) => it.toLowerCase());
  }

  // eslint-disable-next-line class-methods-use-this
  #tabToPhraseList(tab) {
    const fromTitle = this.#normalizeString(tab.title);
    const fromUrl = this.#normalizeString(tab.url);
    return fromTitle.concat(fromUrl);
  }

  /**
   * Since recommendation did fail, we will pick a tab at random
   * @param {Array<EnrichedTab>} all Search among this list of tabs
   * @returns Random tab
   */
  // eslint-disable-next-line class-methods-use-this
  #recommendFailsafe(all) {
    const now = new Date();
    const factor = (100 * now.getHours()) + now.getMinutes();
    const ind = factor % all.length;
    const result = all[ind];
    console.log('Recommending random tab', result);
    return { tab: result, why: 'random' };
  }

  /**
   * From the given tabs selects one that is most similar to the one given
   * @param {EnrichedTab} similarTo Search for a tab similar to this one
   * @param {Array<EnrichedTab>} all Search among this list of tabs
   * @returns First tab from the list that is similar enough to the given one
   */
  recommend(similarTo, all) {
    if (similarTo) {
      const similarToTitleKeywords = this.#normalizeString(similarTo.title);
      console.log('similarTo=', similarTo);
      const similarToUrlKeywords = this.#normalizeString(urlToShortUrl(similarTo.url));
      const similarToKeywords = [...new Set(similarToTitleKeywords.concat(similarToUrlKeywords))];
      console.log('Searching similar to', similarToKeywords);

      const similar = all.find((tab) => {
        const tabWords = this.#tabToPhraseList(tab);
        const overlap = similarToKeywords.filter((val) => tabWords.indexOf(val) !== -1);
        // console.log(`${similarTo.title} <==> ${tab.title}`, overlap);
        // end if we found enough words
        return overlap.length >= this.wordThreshold;
      });
      console.log('Found similar', similar);
      if (similar) {
        return { tab: similar, why: 'similar' };
      }
    }
    // return tab at random if undefined or there's no match
    return this.#recommendFailsafe(all);
  }
}
