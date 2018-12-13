/**
 * @module webgis4u/util/debounce
 */

/**
 * @returns A function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout;

  return (...passedArguments) => {
    const context = this;
    /**
     * Calls the passed `func` with the passed `context` and `arguments`
     */
    const call = () => func.apply(context, ...passedArguments);

    /**
     * Callback to be invoked later
     */
    const later = () => {
      timeout = null;
      if (!immediate) {
        call();
      }
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      call();
    }
  };
}
