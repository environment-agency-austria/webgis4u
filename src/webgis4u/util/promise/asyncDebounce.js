/**
 * @module webgis4u/util/promise/asyncDebounce
 */

/**
 * Debounces a function call returning a promise
 * @param {Function} func Function that returns a promise
 * @param {number} wait The time in milliseconds to wait before the function is called
 */
export function asyncDebounce(func, wait) {
  let timeout;
  let resolvePromise;
  let rejectPromise;
  /**
   * @type {Promise|undefined}
   */
  let promise;

  return (...passedArguments) => {
    const context = this;
    /**
     * Calls the passed `func` with the passed `context` and `arguments`
     * @returns {Promise}
     */
    const call = () => func.apply(context, passedArguments);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      const result = call();
      result.then(resolvePromise);
      result.catch(rejectPromise);
    }, wait);

    // Create the promise, if it does not already exist
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
      });
    }

    return promise;
  };
}
