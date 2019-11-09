/**
 * @module webgis4u/ol/util/zoomToExtent
 */

import * as olExtent from 'ol/extent';

import Settings from '../Settings';

/**
 *
 * @param {*} extent
 * @param {ol.Map} map The map
 */
export function zoomToExtent(extent, map) {
  // Check passed parameters
  if (!extent || !map) { return; }

  if (extent[0] === Infinity || extent[1] === Infinity
    || extent[2] === Infinity || extent[3] === Infinity) {
    return;
  }

  let extentToZoomTo = extent;
  const [extentSizeWidth, extentSizeHeight] = olExtent.getSize(extent);
  if (extentSizeWidth === 0 && extentSizeHeight === 0) {
    extentToZoomTo = olExtent.buffer(extent, Settings.BOUNDINGBOX_BUFFER);
  }

  map.getView().fit(extentToZoomTo, map.getSize());
}
