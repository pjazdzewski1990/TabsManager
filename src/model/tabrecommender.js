// this impl prefers simple, fast heuristic:
// go over the meaningful words and pick the one that has at least "wordThreshold" same words
export class SameWordsTabRecommender {
  constructor(wordThreshold) {
    this.wordThreshold = wordThreshold;
  }

  // eslint-disable-next-line class-methods-use-this
  #normalizeString(str) {
    const safeString = str || '';
    return safeString.trim().split(/[^A-Za-z]/).filter((it) => it.length > 3).map((it) => it.toLowerCase());
  }

  // from the given tabs selects one that is most similar to the one given
  recommend(similarTo, all) {
    console.log('recommend(similarTo, all)', similarTo);
    console.log('recommend(similarTo, all)', all);
    if (similarTo) {
      const similarToWords = this.#normalizeString(similarTo.title);
      const similar = all.find((tab) => {
        const tabWords = this.#normalizeString(tab.title);
        const overlap = similarToWords.filter((val) => tabWords.indexOf(val) !== -1);
        console.log(`${similarTo.title} <==> ${tab.title}`, overlap);
        // end if we found enough words
        return overlap.length >= this.wordThreshold;
      });
      return similar || all[0];
    }
    // return anything if undefined or there's not match
    return all[0];
  }
}