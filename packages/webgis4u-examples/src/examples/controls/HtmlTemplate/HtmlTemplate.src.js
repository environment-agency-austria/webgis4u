import Collection from 'ol/Collection';
import { format as formatCoordinates } from 'ol/coordinate';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import MousePosition from 'ol/control/MousePosition';
import Zoom from 'ol/control/Zoom';
import ZoomSlider from 'ol/control/ZoomSlider';

import { HtmlTemplate, OverviewMap, PanBar, ScaleLine } from 'webgis4u/ol/control';

import * as ExampleHtml from './HtmlTemplate.html';

export const html = ExampleHtml;

/**
 * Returns the default Controls
 */
function defaultControls() {
  const controls = new Collection();

  controls.extend([
    new Zoom(),
    new MousePosition({
      coordinateFormat: coord => formatCoordinates(coord, '{x}&deg;O {y}&deg;N', 5),
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;',
    }),
    new ZoomSlider(),
    new PanBar(),
    // new ugis.ol.control.ActivityControl(),
    new ScaleLine(),
    new OverviewMap(),
    // new ugis.ol.control.SearchControl(),
    new HtmlTemplate(),
  ]);

  return controls;
}

/**
 * Initializes the map
 */
export function initialize(mapConfig) {
  return new Map({
    ...mapConfig,
    target: 'webgis4u-large-map',
    controls: defaultControls(),
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
