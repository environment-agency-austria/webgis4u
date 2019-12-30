import { createEmpty, extend } from 'ol/extent';

/**
 * @typedef {import('ol/extent').Extent} Extent
 */

/**
 * @param {Extent[]} extents The extents to combine
 *
 * @returns {Extent}
 * Extent combined from the given extents
 */
export function fromExtents(...extents) {
  const bBox = createEmpty();

  extents.forEach((e) => { extend(bBox, e); });

  return bBox;
}
