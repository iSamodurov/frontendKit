
/**
 * Re - maps a number from one range to another.
 * @param {*} n
 * @param {*} start1
 * @param {*} stop1
 * @param {*} start2
 * @param {*} stop2
 * @return {*}
 */
function mapRange(n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

export {mapRange};
