/**
 * @module webgis4u/util/formatText
 */

/**
 * Regex to test for a digit inside curly braces
 */
const regex = /{(\d+)}/g;

/**
 * Formats a text
 *
 * @param {string} format The format
 * @param  {...any} args The values that are inserted at the placeholders
 *
 * @returns {string} The result as string
 *
 * @example
 * formatText('{0} is dead, but {1} is alive!', 'ASP',
 * 'ASP.NET'); => 'ASP is dead, but ASP.NET is alive!
 */
export function formatText(format, ...args) {
  return format.replace(regex, (match, number) => {
    return typeof args[number] !== 'undefined' ? args[number] : match;
  });
}
