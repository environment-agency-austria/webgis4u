/**
 * @module webgis4u/util/string/hasValue
 */

/**
 * Check if a param is a string with a value
 *
 * @param {*} s - A value to check
 * @returns `true` if `s` is a string and has a value. Otherwise `false`.
 */
export function hasValue(s) {
  if (s === undefined || s === null) {
    return false;
  }

  if (typeof s !== 'string') { return false; }

  return s.length > 0;
}
