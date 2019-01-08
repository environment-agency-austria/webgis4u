import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import * as proj from 'ol/proj';
import * as extent from 'ol/extent';

import { EPSG31287_ID } from 'webgis4u/ol/proj/austria';
import Color from 'webgis4u/ol/source/basemap/Color';

const EPSG3857_ID = 'EPSG:3857';
/**
 * Initialize the map
 * @param {olx.MapOptions} mapConfig
 */
export function initialize(mapConfig) {
  const map = new Map({
    ...mapConfig,
    layers: [
      new TileLayer({
        source: new Color(),
      }),
    ],
    view: new View({
      // set the projection
      projection: EPSG3857_ID,
      // restrict the view center to be moved outside the
      // given extent
      extent: proj.transformExtent(
        proj.get(EPSG31287_ID).getExtent(), EPSG31287_ID, EPSG3857_ID,
      ),
      // set the center to projections center
      center: proj.transform(
        extent.getCenter(
          proj.get(EPSG31287_ID).getExtent(),
        ), EPSG31287_ID, EPSG3857_ID,
      ),
      // set the for the user available zoom factors
      minZoom: 6,
      maxZoom: 24,
      zoom: 6,
    }),
  });
}
