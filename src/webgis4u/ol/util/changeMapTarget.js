/**
 * @module webgis4u/ol/util/changeMapTarget
 */

import { OL_CLASS_VIEWPORT } from '../common';

/**
 *
 * @param {HTMLElement} element The new element for the map
 * @param {ol.Map} map The map.
 */
export function updateMapTarget(element, map) {
  // remove DOM for current map */
  const currentMapTarget = map.getTargetElement();
  currentMapTarget.innerHTML = '';

  // remove DOM from the openlayers html of the new map (if any)
  const viewports = element.getElementsByClassName(OL_CLASS_VIEWPORT);
  Array.prototype.forEach.call(viewports, (viewport) => {
    // eslint-disable-next-line no-param-reassign
    viewport.innerHTML = '';
  });

  const currentExtent = map.getView().calculateExtent(map.getSize());
  // the controlls interact with the template (they autodetect them and have therefore to be reinitialized
  const controls = map.getControls();
  map.setTarget(element);
  controls.forEach((ctrl) => {
    ctrl.setMap(map);
  });

  /* ensure that the last map extent is shown */
  map.getView().fit(currentExtent, map.getSize());
}

/**
 * Changes the maps target element (in the case the element is found).
 * @param {string} elementId The unique element edi of the map.
 * @param {ol.Map} map The map.
 *
 * @example
 * //Change the current map and show it in the new element with the given unique element id.
 * changeMapTarget('myNewTargetId', myMap);
 */
export function changeMapTarget(elementId, map) {
  // Find the element
  const element = document.getElementById(elementId);

  if (!element) {
    console.log(`changeMapTarget: Element with id ${elementId} does not exist`);
    return;
  }

  updateMapTarget(element, map);
}
