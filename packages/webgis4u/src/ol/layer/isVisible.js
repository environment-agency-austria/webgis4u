import { isDisplayable } from './isDisplayable';

/**
 * @typedef {module:ol/layer/Base~BaseLayer} BaseLayer
 */
/**
 * @typedef {module:ol/map~Map} Map
 */
/**
 * @typedef {module:ol/view~View} View
 */

/**
 * @param {BaseLayer} layer The layer
 * @param {number} resolution The resolution
 *
 * @returns {boolean}
 * If true, the layer is visible and can be shown in the given resolution
 */
export function isVisible(layer, resolution) {
  return layer.getVisible() && isDisplayable(layer, resolution);
}

/**
 * Determines whether the layer is visbible and displayable.
 * @param {BaseLayer} layer  The layer.
 * @param {View} view The map.
 *
 * @returns {boolean}
 * If true, the layer is visible in the view
 */
export function isVisibleInView(layer, view) {
  return isVisible(layer, view.getResolution());
}

/**
 * Determines whether the layer is visbible and displayable.
 * @param {BaseLayer} layer  The layer.
 * @param {Map} map The map.
 *
 * @returns {boolean}
 * If true, the layer is visible in the map
 */
export function isVisibleForMap(layer, map) {
  return isVisibleInView(layer, map.getView());
}
