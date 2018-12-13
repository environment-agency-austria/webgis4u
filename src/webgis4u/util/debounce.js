/**
 * @module webgis4u/util/debounce
 */

/**
 *
 * Creates a function that will not be called, as long as it continues to be invoked
 * within `wait` milliseconds.
 *
 * @param {Function} func The function that should be debounced
 * @param {number} wait The time in milliseconds that must pass before `func` is called
 * @param {boolean} immediate If true, `func` is called on the leading edge instead of the trailing.
 *
 * @returns {Function} A function, that, as long as it continues to be invoked, will not
 * be triggered.
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
