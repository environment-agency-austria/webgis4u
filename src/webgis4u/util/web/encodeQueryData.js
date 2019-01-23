/**
 * @module webgis4u/util/web/encodeQueryData
 */

/**
 * Encodes a given object to use as a query string
 * @param {object} data The data to encode
 * @returns {string} The encoded query string
 */
export function encodeQueryData(data) {
  const ret = [];
  Object.keys(data).forEach((key) => {
    ret.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
  });
  return ret.join('&');
}
