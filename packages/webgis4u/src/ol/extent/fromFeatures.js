import { createEmpty, extend } from 'ol/extent';

/**
 * @typedef {module:ol/feature~Feature} Feature
 */
/**
 * @typedef {module:ol/Collection~Collection<Feature>} FeatureCollection
 */
/**
 * @typedef {module:ol/extent~Extent} Extent
 */

/**
 * @param {Feature[] | FeatureCollection} features
 *
 * @returns {module:ol/extent~Extent}
 * Creates a bounding box extent from the given features
 */
export function fromFeatures(features) {
  const bBox = createEmpty();

  features.forEach((f) => {
    extend(bBox, f.getGeometry().getExtent());
  });

  return bBox;
}
