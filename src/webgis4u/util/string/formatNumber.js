/**
 * @module webgis4u/util/string/formatNumber
 */

/**
 * Regex to test for a digit followed by 3 more digits
 */
const rgx = /(\d+)(\d{3})/;

/**
 * Groups a number
 * @param {string} number The number to group
 * @returns {string}
 */
function groupNumber(number) {
  let n = number;

  while (rgx.test(n)) {
    n = n.replace(rgx, '$1.$2');
  }

  return n;
}

/**
 * Formats a number. In the case no number is provided 'NaN' is returned.
 *
 * @param {number} number The number to format.
 * @param {decimals} [decimals] The optional number of decimals.
 *
 * @returns {string} The formated number as text.
 */
export function formatNumber(number, decimals) {
  const _number = Number(number).toFixed(decimals);
  const [integer, fraction] = _number.split('.');

  const groupedInteger = groupNumber(integer);

  return (fraction === undefined)
    ? groupedInteger
    : `${groupedInteger},${fraction}`;
}
