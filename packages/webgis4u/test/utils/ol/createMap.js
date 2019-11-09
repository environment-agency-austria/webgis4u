import Map from 'ol/Map';
import View from 'ol/View';

import { createLayers } from './createLayers';
import { tileLoadFunction } from './tileLoadFunction';

/**
 * Creates a simple map
 * @param {Object} [mapConfig] Additional map configuration
 */
export const createMap = (mapConfig) => {
  const target = document.createElement('div');
  const size = '100px';
  target.style.width = size;
  target.style.width = size;
  document.body.appendChild(target);

  const map = new Map({
    target,
    layers: createLayers({ count: 1 }),
    view: new View({
      center: [0, 0],
      zoom: 0,
      extent: [-2.5, -2.5, 2.5, 2.5],
      resolution: 1,
      resolutions: [4, 2, 1, 0.5, 0.25],
    }),
    ...mapConfig,
  });

  map.getLayers().forEach((layer) => {
    const source = layer.getSource();
    source.getTile = tileLoadFunction;
  });

  return map;
};
