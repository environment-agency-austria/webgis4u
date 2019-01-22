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
  const t = {};
  return Promise.race([p, t])
    .then(
      v => ((v === t)
        ? PromiseStateEnum.Pending
        : PromiseStateEnum.Fulfilled),
      () => PromiseStateEnum.Rejected,
    );
}
