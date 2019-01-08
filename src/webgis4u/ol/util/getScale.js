/**
 * @module webgis4u/ol/util/getScale
 */

import { getWidth } from 'ol/extent';
import { transformExtent } from 'ol/proj';

import { formatNumber } from '../../util/string/formatNumber';
import { EPSG31287_ID } from '../proj/austria';


/**
 * @typedef {Object} Scale  The map scale.
 * @property {number} resolution The map resolution in m per pixel.
 * @property {number} denominator The map denominator (fraction).
 * @property {string} formated The pretty formated scale.
 *
 * @example
 * {resolution:35.27, denominator: 100000, formated: '1:100.000'}
 */

/**
 *
 * Gets the map Scale
 * @param {ol.Map} map The map whose scale will be returned.
 * @returns {Scale} The scale.
 * @example
 * // Get the map scale
 * ugis.ol.util.getScale(myMap);
 */
export function getScale(map) {
  let resolution;
  let denominator;
  try {
    const mapSize = map.getSize();
    const mapView = map.getView();
    const mapViewProjection = mapView.getProjection();

    resolution = getWidth(
      transformExtent(mapView.calculateExtent(mapSize), mapViewProjection, EPSG31287_ID),
    ) / mapSize[0];
    if (mapViewProjection.getUnits() === 'm') {
      denominator = Math.round(72 / 0.0254 * resolution);
    }
  } catch (e) {
    // console.log(e);
  }

  return {
    resolution,
    denominator,
    formated: `1: ${formatNumber(denominator, 0)}`,
  };
}
