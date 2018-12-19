import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import { createXYZ } from 'ol/tilegrid';

import { disposeMap, tileLoadFunction } from '../../../../test-utils/ol';

import PanBar from './PanBar';

describe('webgis4u/ol/control/PanBar', () => {
  let map;

  beforeEach(() => {
    const target = document.createElement('div');
    const size = '100px';
    target.style.width = size;
    target.style.width = size;
    document.body.appendChild(target);
    map = new Map({
      target,
      controls: [new PanBar()],
      layers: [
        new TileLayer({
          source: new TileSource({
            projection: 'EPSG:3857',
            tileGrid: createXYZ(),
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });

    map.getLayers().forEach((layer) => {
      const source = layer.getSource();
      source.getTile = tileLoadFunction;
    });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
  });

  it('should render', () => {
    map.renderSync();
    const panBar = map.getTarget().querySelectorAll('.ugis-ctrl-panbar');
    expect(panBar.length).toBe(1);
  });
});
