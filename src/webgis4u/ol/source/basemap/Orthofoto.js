import WMTS from 'ol/source/WMTS';
import { urlsJpg, tileGrid, projection } from './common';

/**
 * The basemap.at orthofoto layer as predefined ol.source.WMTS source.
 *
 * @extends {ol.source.WMTS}
 * @memberof module:webgis4u/ol/source/basemap
 */
class Orthofoto extends WMTS {
  /**
   * Constructor
   */
  constructor() {
    super({
      projection,
      tileGrid,
      urls: urlsJpg,

      crossOrigin: 'anonymous',
      tilePixelRatio: 1,
      layer: 'bmaporthofoto30cm',
      style: 'normal',
      matrixSet: 'google3857',
      requestEncoding: ('REST'),
    });
  }
}

export default Orthofoto;
