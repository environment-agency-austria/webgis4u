import { boundingExtent } from 'ol/extent';

/**
 * @typedef {module:ol/pixel~Pixel} Pixel
 */
/**
 * @typedef {module:ol/map~Map} Map
 */
/**
 * @typedef {module:ol/layer/Vector~VectorLayer} VectorLayer
 */
/**
 * @typedef {module:ol/feature~Feature} Feature
 */

/**
 * @param {object} options
 * @param {Map} options.map The map
 * @param {VectorLayer} options.layer The layer
 * @param {Pixel} options.pixel The pixel
 * @param {boolean} [options.clone=true] If true, the feature will be cloned
 * @param {number} [options.hitTolerance=0] The hit tolerance
 *
 * @returns {Feature[]}
 * The features in this layer at the given pixel.
 */
export function getFeaturesAtPixel(options) {
  const { pixel, map, layer, clone = true, hitTolerance = 0 } = options;

  /**
   * @type {Feature[]}
   */
  const features = [];
  const [px, py] = pixel;
  // X-axis pixel (origin on the top left, x increase toward the right)
  // Y-axis pixel (origin at the top, y increase toward the bottom)
  const pMin = [px - hitTolerance, py - hitTolerance];
  const pMax = [px + hitTolerance, py + hitTolerance];
  const coordMin = map.getCoordinateFromPixel(pMin);
  const coordMax = map.getCoordinateFromPixel(pMax);
  const extent = boundingExtent([coordMin, coordMax]);

  layer.getSource().forEachFeatureIntersectingExtent(
    extent,
    (feature) => {
      features.push(clone ? feature.clone() : feature);
    },
  );

  return features;
}
