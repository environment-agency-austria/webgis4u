import TileLayer from 'ol/layer/Tile';
import TileSource from 'ol/source/Tile';
import { createXYZ } from 'ol/tilegrid';

/**
 * Creates a new layer
 * @returns {ol.layer.Layer}
 */
function createLayer() {
  return new TileLayer({
    source: new TileSource({
      projection: 'EPSG:3857',
      tileGrid: createXYZ(),
    }),
  });
}

/**
 * Create simple layers
 * @param {Object} options The options
 * @param {number} options.count The number of layers
 *
 * @returns {Array<ol.layer.Layer>} An array of layers
 */
export function createLayers(options) {
  const { count } = options;
  const layers = [];

  for (let i = 0; i < count; ++i) {
    layers.push(createLayer());
  }

  return layers;
}
