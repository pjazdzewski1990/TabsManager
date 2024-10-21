// use this for performance - provides timing on operations
let previousTimestamp = +new Date();

/* eslint-disable import/prefer-default-export */
export function tagTime(tag) {
  return (data) => {
    // the plus converts the date into a number
    const currentTimestamp = +new Date();
    console.log(`${tag.toString()} @ ${previousTimestamp}>${currentTimestamp}, since last timestamp: ${currentTimestamp - previousTimestamp}ms`);
    previousTimestamp = currentTimestamp;
    return data;
  };
}
