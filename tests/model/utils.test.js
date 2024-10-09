import {jest} from '@jest/globals';

import {debounce} from '../../src/utils.js';

test('debounce should convert mutliple calls to function into a single one', () => {
    jest.useFakeTimers();
    const delay = 250;
    let counter = 0;
    const update = (toAdd) => {
        counter = counter + toAdd;
    };
    const debouncedUpdate = debounce(update, delay);
    
    debouncedUpdate(1);
    debouncedUpdate(2);
    debouncedUpdate(3);
    debouncedUpdate(4); // only the last one should take effect
    jest.runAllTimers();
    expect(counter).toEqual(4);
});