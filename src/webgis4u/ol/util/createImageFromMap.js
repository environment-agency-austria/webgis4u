/**
 * @module webgis4u/ol/util/createImageFromMap
 */

/**
 * Callback used by myFunction.
 * @callback CreateImageFromMapCallback
 * @param {string} base64Image
 */

/**
 * Exports asynchron map as base 64 encoded string. The result can be processed further either on the client or the server side.
 * @param {ol.Map} map2export The map to be exported.
 * @param {module:webgis4u/ol/util/createImageFromMap~CreateImageFromMapCallback} callback The callback.
 * @throws {Error} Is thrown in the case the map cannot be exported.
 *
 * @example
 * // calls the callback function with the base 64 encoded map image (e.g. "data:image/png;base64, iVBORw0KGgoAAAANSU...").
 * createImageFromMap(myMap, (base64Image) => {console.log(base64Image);});
 */
export function createImageFromMap(map2export, callback) {
  try {
    map2export.once('postcompose', (event) => {
      callback(event.context.canvas.toDataURL());
    });
    map2export.renderSync();
  } catch (e) {
    console.log(e);
    throw new Error('Unable to export map.');
  }
}
