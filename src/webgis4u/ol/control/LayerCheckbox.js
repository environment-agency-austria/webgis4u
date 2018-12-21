/**
 * @module webgis4u/ol/control/LayerCheckbox
 */

import Control from 'ol/control/Control';
import Layer from 'ol/layer/Layer';

import { createElement } from '../../util/dom/createElement';

/**
 * @typedef EventListenerMap
 * @type {Object.<string, Function>}
 */

/**
 * @typedef LayerMap
 * @type {Object.<string, ol.layer.Layer>}
 */

/**
 * @typedef LayerCheckboxOptions
 * @type {LayerMap}
 */


/**
 * Control to control layer visibility
 *
 * @extends {module:ol.control.Control}
 */
class LayerCheckbox extends Control {
  /**
   * Event listener map
   * @type {EventListenerMap}
   * @private
   */
  listeners = {};

  /**
   * The previous map
   * @type {ol.Map}
   * @private
   */
  oldMap = null;

  /**
   * Map of layers
   * @type {LayerMap}
   * @private
   */
  layerMap;

  /**
   * Creates a new LayerCheckbox
   *
   * @param {LayerCheckboxOptions} options
   * The options
   */
  constructor(options) {
    const element = createElement({ tag: 'div' });

    super({
      element,
      target: null,
    });

    const o = options || {};
    this.layerMap = o;
  }

  /**
   * @inheritdoc
   */
  setMap(map) {
    const { layerMap } = this;
    const keys = Object.keys(layerMap);

    // First remove previous added interactions
    if (this.oldMap) {
      keys.forEach((key) => {
        this.removeInteraction(key);
      });
    }

    // Update new map
    this.oldMap = map;
    super.setMap(map);

    // Add new interactions if map is available
    if (!map) { return; }
    keys.forEach((key) => {
      this.addInteraction(key, layerMap[key]);
    });
  }

  /**
   * Add interaction for a layer
   * @param {string} key The ID of the element used to control the layer
   * @param {ol.layer.Layer} layer The layer
   *
   * @private
   */
  addInteraction(key, layer) {
    // Check if a valid layer was passed
    if (!layer || !(layer instanceof Layer)) { return; }

    // Look for the element
    const e = document.getElementById(key);
    if (!e) { return; }

    // Update the element checked state accordingly
    e.checked = layer.getVisible();
    // Create an event listener for the element
    /**
     * Event listener
     */
    const listener = () => {
      layer.setVisible(e.checked);
    };
    e.addEventListener('click', listener, false);
    this.listeners[key] = listener;
  }

  /**
   * Remove the interaction from the element.
   * @param {string} key The key of the element where to remove from
   *
   * @private
   */
  removeInteraction(key) {
    // Look for the key in listeners
    const listener = this.listeners[key];
    if (!listener) { return; }

    // Look for the element
    const e = document.getElementById(key);
    if (e) {
      // Remove the listener
      e.removeEventListener('click', listener, false);
    }

    // Remove the listener
    delete this.listeners[key];
  }
}

export default LayerCheckbox;
