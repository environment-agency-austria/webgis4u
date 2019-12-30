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
 * @typedef {module:ol/layer/Base~BaseLayer} BaseLayer
 */

/**
 * @param {BaseLayer} layer The layer
 * @param {number} resolution The resolution
 *
 * @returns {boolean}
 * If true, the layer can be shown in the given resolution
 */
export function isDisplayable(layer, resolution) {
  return (
    layer.getMinResolution() <= resolution
    && layer.getMaxResolution() >= resolution
  );
}
