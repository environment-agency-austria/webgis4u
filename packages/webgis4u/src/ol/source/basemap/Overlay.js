import WMTS from 'ol/source/WMTS';
import { urlsPng, tileGrid, projection } from './common';

/**
 * The basemap.at overlay layer as predefined ol.source.WMTS source.
 *
 * @extends {ol.source.WMTS}
 * @memberof module:webgis4u/ol/source/basemap
 */
class Overlay extends WMTS {
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
      layer: 'bmapoverlay',
      style: 'normal',
      matrixSet: 'google3857',
      requestEncoding: ('REST'),
    });
  }
}

export default Overlay;
