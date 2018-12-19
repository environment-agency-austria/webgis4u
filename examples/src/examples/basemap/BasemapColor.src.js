import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';

import Color from 'webgis4u/ol/source/basemap/Color';

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
      center: [0, 0],
      zoom: 2,
    }),
  });
}
