/**
 * @module webgis4u/util/pan
 */

import { getSize } from 'ol/extent';

/**
 * Pans the displayed map extent with the deltaX and deltyY factor of the currently displayed map
 * @param {number} deltaX The deltaX pan factor
 * @param {number} deltaY The deltaY pan factor
 * @param {ol.Map} map The map
 *
 * @example
 * //move the map 30% left and 40% upward.
 * pan(-0.3, 0.4, myMap);
 */
export function pan(deltaX, deltaY, map) {
  const mapSize = getSize(map.getView().calculateExtent(map.getSize()));
  const cC = map.getView().getCenter();
  const newCenter = [cC[0] + mapSize[0] * deltaX, cC[1] + mapSize[1] * deltaY];

  map.getView().animate({
    center: map.getView().constrainCenter(newCenter),
  });
}
