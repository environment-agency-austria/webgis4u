import { createEmpty, extend } from 'ol/extent';

/**
 * @typedef {import('ol/Collection').default<Feature>} FeatureCollection
 */
/**
 * @typedef {import('ol/extent').Extent} Extent
 */
/**
 * @typedef {import('ol/feature').default} Feature
 */

/**
 * @param {Feature[] | FeatureCollection} features
 *
 * @returns {Extent}
 * Creates a bounding box extent from the given features
 */
export function fromFeatures(features) {
  const bBox = createEmpty();

  features.forEach(f => {
    extend(bBox, f.getGeometry().getExtent());
  });

  return bBox;
}
