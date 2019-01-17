/**
 * @module webgis4u/ol/util/print
 */

import { createImageFromMap } from './createImageFromMap';
import OverviewMap from '../control/OverviewMap';
import ScaleLine from '../control/ScaleLine';

/**
 * @typedef PrintMapResult
 * @type {object}
 * @property {string} map The original map
 * @property {string} [overviewMap] The overviewMap map
 * @property {string} [scaleLine] The scaleLine
 */

/**
 * Callback used by print.
 * @callback PrintMapCallback
 * @param {module:webgis4u/ol/util/print~PrintMapResult} result The result from the print operation
 */

/**
 * Prints asynchron map as base 64 encoded string.
 *
 * @param {ol.Map} map2print The map to be printed
 * @param {module:webgis4u/ol/util/print~PrintMapCallback} callback
 * @throws {Error} Is thrown in the case the map cannot be exported.
 *
 * @example
 * // calls the callback function.
 * ugis.ol.util.exportMap(myMap, function(print){console.log(print);});
 */
export function print(map2print, callback) {
  const result = {};

  // TODO: Check for asynchronus problems
  createImageFromMap(map2print, (mapBase64Encoded) => {
    result.map = mapBase64Encoded;
    map2print.getControls().forEach((control) => {
      if (control instanceof OverviewMap) {
        createImageFromMap(control.getOverviewMap(), (overviewMapEncoded64BitImage) => {
          result.overviewMap = overviewMapEncoded64BitImage;
        });
      } else if (control instanceof ScaleLine) {
        result.scaleLine = control.export();
      }
    });
    callback(result);
  });
}
