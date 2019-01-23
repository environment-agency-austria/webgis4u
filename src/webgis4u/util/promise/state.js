/**
 * @module webgis4u/util/promise/state
 */

/**
 * @enum
 */
export const PromiseStateEnum = {
  Pending: 'pending',
  Fulfilled: 'fulfilled',
  Rejected: 'rejected',
};
Object.freeze(PromiseStateEnum);

/**
 * Unique symbol used to identify the value returned by Promise.race
 */
const promiseStateSymbol = Symbol('promiseState');

/**
 * Encodes a given object to use as a query string
 * @param {Promise} p The promise
 * @returns {string} The encoded query string
 *
 * @example
 * if(await state(p) === PromiseStateEnum.Pending) {
 *    // promise is pending
 * }
 */
export function state(p) {
  return Promise.race([p, promiseStateSymbol])
    .then(
      v => ((v === promiseStateSymbol)
        ? PromiseStateEnum.Pending
        : PromiseStateEnum.Fulfilled),
      () => PromiseStateEnum.Rejected,
    );
}
