import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import Measure, { MeasurementTypeEnum } from 'webgis4u/ol/control/Measure';

/**
 * Initializes the map
 */
export function initialize(mapConfig) {
  const map = new Map({
    ...mapConfig,
    controls: defaultControls().extend([
      new Measure({
        type: MeasurementTypeEnum.Area,
      }),
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
