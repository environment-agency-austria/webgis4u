/**
 * @module webgis4u/util/string/formatUnitValue
 */

import { convertUnitValue } from '../number/convertUnitValue';
import { formatNumber } from './formatNumber';

/**
 * @typedef Unit
 * @type {object}
 * @property {number} [factor=1] The factor used to convert a number
 * @property {string} abbreviation The abbreviation used for this unit
 * @property {number} [limit=factor] The limit at which it shall be converted to this unit
 * @property {boolean} [fallback=false] If true, this unit will be used as a fallback
 */

/**
 * @typedef FormatUnitValueOptions
 * @type {object}
 * @property {number} value The value that should be formatted
 * @property {number} decimals The number of decimals
 * @property {Array<Unit>} units The units that should be considered by this function
 */

/**
 * Formats a value according to the passed options
 * @param {FormatUnitValueOptions} options The options
 */
export function formatUnitValue(options) {
  const { decimals, ...convertUnitValueOptions } = options;

  const { convertedValue, unit: { abbreviation } } = convertUnitValue(convertUnitValueOptions);

  return `${formatNumber(convertedValue, decimals)} ${abbreviation}`;
}
