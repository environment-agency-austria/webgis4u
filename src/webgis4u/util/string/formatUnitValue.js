/**
 * @module webgis4u/util/string/formatUnitValue
 */

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
  const { value, units, decimals } = options;

  let fallbackUnit = units[0];
  let nearestUnit;
  let nearestUnitLimitDistance = Number.POSITIVE_INFINITY;

  // Find the unit to use
  units.forEach((u) => {
    const { factor } = u;
    let { limit } = u;

    // Limit is the given limit or the factor
    limit = u.limit || ((factor === undefined) ? 1 : factor);
    const limitDistance = value - limit;
    if (limitDistance >= 0 && limitDistance < nearestUnitLimitDistance) {
      nearestUnit = u;
      nearestUnitLimitDistance = limitDistance;
    }

    if (u.fallback === true) {
      fallbackUnit = u;
    }
  });

  const unit = nearestUnit || fallbackUnit;
  const { factor, abbreviation } = unit;
  // Let the factor default to 1
  const convertedValue = (factor !== undefined)
    ? value / factor
    : value;

  return `${formatNumber(convertedValue, decimals)} ${abbreviation}`;
}
