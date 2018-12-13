/**
 * @module webgis4u/ol/source/basemap/Overlay
 */

import WMTS from 'ol/source/WMTS';

import { urlsPng, tileGrid, projection } from './common';

/**
 * The basemap.at overlay layer as predefined ol.source.WMTS source.
 *
 * @extends {ol.source.WMTS}
 * @memberOf ugis.ol.source.basemap
 *
 * @example
 * var myWMTSOverlaySource = new ugis.ol.source.basemap.Overlay();
 *
 */
class Overlay extends WMTS {
  constructor() {
    super({
      projection,
      tileGrid,
      urls: urlsPng,

      crossOrigin: 'anonymous',
      tilePixelRatio: 1,
      layer: 'bmapoverlay',
      style: 'normal',
      matrixSet: 'google3857',
      requestEncoding: ('REST'),
    });
  }
}

export default Overlay;
