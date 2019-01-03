/**
 * @module webgis4u/util/ol/getMapChildElementByClassName
 */

/**
 * @typedef GetMapChildElementByClassNameOptions
 * @type {object}
 * @property {ol.Map} map The map
 * @property {string} className The class name
 */

/**
 * Retruns an element selected by its class name
 * @param {GetMapChildElementByClassNameOptions} options The options
 *
 * @returns {HTMLElement|null} The first HTML element that fits the class selector or null
 */
export function getMapChildElementByClassName(options) {
  const { map, className } = options;
  if (!map) { return null; }

  const mapElement = map.getTargetElement();
  const elementsInMapDOM = mapElement.getElementsByClassName(className);
  if (elementsInMapDOM.length < 1) { return null; }

  return elementsInMapDOM[0];
}
