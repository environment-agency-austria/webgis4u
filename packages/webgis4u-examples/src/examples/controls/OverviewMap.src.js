import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import OverviewMap from 'webgis4u/ol/control/OverviewMap';

export const html = '<div class="webgis4u-control-overviewmap" />';

/**
 * Initializes the map
 */
export function initialize(mapConfig) {
  return new Map({
    ...mapConfig,
    controls: defaultControls().extend([
      new OverviewMap(),
    ]),
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });
}
