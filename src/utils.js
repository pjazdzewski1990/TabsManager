// generic tools

// pause execution for "wait" millis, then execute callback
// when called N times will trigger just once after the last wait period
export function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
};