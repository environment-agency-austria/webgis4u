/**
 * @module webgis4u/util/pan
 */

import { getSize } from 'ol/extent';

/**
 * @typedef PanOptions
 * @property {ol.coordinate.Coordinate} delta The delta pan factor
 * @property {ol.Map} map The map
 * @property {olx.animation.AnimateOptions} [animationOptions] Additional options for an animation
 */

/**
 * Pans the displayed map extent with the deltaX and deltyY factor of the currently displayed map
 * @param {PanOptions} options The options for the interaction
 *
 * @example
 * //move the map 30% left and 40% upward.
 * pan({delta: [-0.3, 0.4], map: myMap});
 */
export function pan(options) {
  const {
    delta, map, animationOptions,
  } = options;
  const view = map.getView();

  const mapSize = getSize(view.calculateExtent(map.getSize()));
  const cC = view.getCenter();
  const newCenter = [cC[0] + mapSize[0] * delta[0], cC[1] + mapSize[1] * delta[1]];

  view.animate({
    ...animationOptions,
    center: view.constrainCenter(newCenter),
  });
}
