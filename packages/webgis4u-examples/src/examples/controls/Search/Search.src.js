import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { Search } from 'webgis4u/ol/control';

import * as ExampleHtml from './Search.html';

export const html = ExampleHtml;

/**
 *
 */
class MockXMLHttpRequest {
  static mockResponse;

  status = 0;

  readyState = 4;

  send() {
    setTimeout(() => {
      this.response = MockXMLHttpRequest.mockResponse;
      this.status = 200;
      this.onload();
    }, 2000);
  }

  open(type, url, bool) {
    console.error('Open called with', type, url, bool);
  }
}

/**
 *
 */
function simulateRequest() {
  const oldXMLHttpRequest = window.XMLHttpRequest;

  /** */
  const createRandomChoice = (id, coordinates) => {
    return {
      value: `Auswahl ${id}`,
      data: {
        type: 'Feature',
        crs: {
          type: 'name',
          properties: {
            name: 'EPSG:31287',
          },
        },
        geometry: {
          coordinates,
          type: 'Point',
        },
        properties: {
          lid: 'geonames.org',
          fid: '138733',
        },
      },
    };
  };


  const choices = [
    createRandomChoice(1, [604373.0, 432958.0]),
    createRandomChoice(2, [603898.0, 434253.0]),
    createRandomChoice(3, [603945.0, 433583.0]),
    createRandomChoice(4, [603489.0, 433385.0]),
    createRandomChoice(5, [604373.0, 432958.0]),
    createRandomChoice(6, [604178.0, 434296.0]),
    createRandomChoice(7, [604161.0, 432858.0]),
    createRandomChoice(8, [603740.0, 432906.0]),
    createRandomChoice(9, [603818.0, 433971.0]),
    createRandomChoice(10, [603944.0, 434558.0]),
    createRandomChoice(11, [603972.0, 434732.0]),
    createRandomChoice(12, [603814.0, 434051.0]),
    createRandomChoice(13, [603877.0, 434351.0]),
    createRandomChoice(14, [603949.0, 434076.0]),
    createRandomChoice(15, [603710.0, 434458.0]),
  ];

  MockXMLHttpRequest.mockResponse = choices;
  window.XMLHttpRequest = MockXMLHttpRequest;
}

/**
 * Initializes the map
 */
export function initialize(mapConfig) {
  simulateRequest();
  return new Map({
    ...mapConfig,
    target: 'webgis4u-large-map',
    controls: [
      new Search({
      }),
    ],
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
