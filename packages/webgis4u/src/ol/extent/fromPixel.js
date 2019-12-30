import { boundingExtent } from 'ol/extent';
import { toSize } from 'ol/size';

/**
 * @typedef {object} FromPixelOptions
 * @property {module:ol/pixel~Pixel} pixel The pixel representing the center
 * @property {module:ol/size~Size | number} size The size of the extent in pixels
 * @property {module:ol/Map~Map} map The map
 */

/**
 * @param {FromPixelOptions} options The options
 *
 * @returns {module:ol/extent~Extent}
 * Extent from a given pixel in the center and with a given size for a specific map.
 */
export function fromPixel(options) {
  const { pixel, size, map } = options;
  const [width, height] = toSize(size);
  const w = width / 2;
  const h = height / 2;
  const [x, y] = pixel;
  const boundingPixels = [[x - w, y], [x + w, y], [x, y - h], [x, y + h]];

  return boundingExtent(boundingPixels.map(p => map.getCoordinateFromPixel(p)));
}
