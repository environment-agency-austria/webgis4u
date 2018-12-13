/**
 * @module webgis4u/ol/source/basemap/Gray
 */

import WMTS from 'ol/source/WMTS';

import { urlsPng, tileGrid, projection } from './common';

/**
 * The basemap.at gray layer as predefined ol.source.WMTS source.
 *
 * @extends {ol.source.WMTS}
 * @memberOf ugis.ol.source.basemap
 *
 * @example
 * var myWMTSGraySource = new ugis.ol.source.basemap.Gray();
 */
class Gray extends WMTS {
  /**
   * Constructor
   */
  constructor() {
    super({
      projection,
      tileGrid,
      urls: urlsPng,

      crossOrigin: 'anonymous',
      tilePixelRatio: 1,
      layer: 'bmapgrau',
      style: 'normal',
      matrixSet: 'google3857',
      requestEncoding: ('REST'),
    });
  }
}

export default Gray;
