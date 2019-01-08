/**
 * @module webgis4u/util/number/convertUnitValue
 */

/**
 * @typedef Unit
 * @type {object}
 * @property {number} [factor=1] The factor used to convert a number
 * @property {string} abbreviation The abbreviation used for this unit
 * @property {number} [limit=factor] The limit at which it shall be converted to this unit
 * @property {boolean} [fallback=false] If true, this unit will be used as a fallback
 */

/**
 * @typedef ConvertUnitValueOptions
 * @type {object}
 * @property {number} value The value that should be formatted
 * @property {Array<Unit>} units The units that should be considered by this function
 */

/**
 * @typedef ConvertUnitValueResult
 * @type {object}
 * @property {number} value The original value
 * @property {number} convertedValue The converted value
 * @property {Unit} unit The unit to which the value was converted to
 */

/**
 * Formats a value according to the passed options
 * @param {ConvertUnitValueOptions} options The options
 *
 * @returns {ConvertUnitValueResult}
 */
export function convertUnitValue(options) {
  const { value, units } = options;

  let fallbackUnit = units[0];
  let nearestUnit;
  let nearestUnitLimitDistance = Number.POSITIVE_INFINITY;
  const absValue = Math.abs(value);

  // Find the unit to use
  units.forEach((u) => {
    let { limit, factor } = u;

    // Default factor to 1
    factor = (factor === undefined) ? 1 : factor;
    // Default limit to the value of factor
    limit = u.limit || factor;

    const limitDistance = absValue - limit;
    if (limitDistance >= 0 && limitDistance < nearestUnitLimitDistance) {
      nearestUnit = u;
      nearestUnitLimitDistance = limitDistance;
    }

    if (u.fallback === true) {
      fallbackUnit = u;
    }
  });

  const unitToUse = nearestUnit || fallbackUnit;
  // Let the factor default to 1
  const unit = { factor: 1, ...unitToUse };
  const { factor } = unit;
  const convertedValue = value / factor;

  return {
    value,
    convertedValue,
    unit,
  };
}
