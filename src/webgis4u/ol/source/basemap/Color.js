/**
 * @module webgis4u/ol/source/basemap/Color
 */

import WMTS from 'ol/source/WMTS';
import { urlsPng, tileGrid, projection } from './common';

/**
 * Layer source for the Basemap.at tile server.
 *
 * @extends {ol.source.WMTS}
 * @memberOf ugis.ol.source.basemap
 */
class Color extends WMTS {
  constructor() {
    super({
      projection,
      tileGrid,
      urls: urlsPng,

      crossOrigin: 'anonymous',
      tilePixelRatio: 1,
      layer: 'geolandbasemap',
      style: 'normal',
      matrixSet: 'google3857',
      requestEncoding: ('REST'),
    });
  }
}

export default Color;
