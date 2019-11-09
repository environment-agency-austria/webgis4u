/**
 * @module webgis4u/ol/util/zoomToLayerExtent
 */
import * as olExtent from 'ol/extent';

import { zoomToExtent } from './zoomToExtent';

/**
 * Gets the extent of an vector layer.
 * @param {ol.layer.Vector} vectorLayer The vector layer.
 * @param {ol.Map} map The map.
 * @returns {ol.Extent} The extent.
 */
export function zoomToLayerExtent(vectorLayer, map) {
  const extent = olExtent.createEmpty();
  vectorLayer.getSource().forEachFeature((feature) => {
    olExtent.extend(extent, feature.getGeometry().getExtent());
  });

  return zoomToExtent(extent, map);
}
