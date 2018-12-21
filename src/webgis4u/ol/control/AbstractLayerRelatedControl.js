/**
 * @module webgis4u/ol/control/AbstractLayerRelatedControl
 */

import Control from 'ol/control/Control';
import Layer from 'ol/layer/Layer';

/**
 * @typedef EventListenerMap
 * @type {Object.<string, Function>}
 */

/**
 * @typedef LayerMap
 * @type {Object.<string, ol.layer.Layer>}
 */

/**
 * @typedef LayerRelatedControlOptions
 * @type {object}
 * @property {*} controlOptions
 * @property {LayerMap} layerMapOptions
 */

/**
 * @typedef LayerActionEventArgs
 * @property {Event} originalEvent The original event
 * @property {string} key The key for which the event was raised
 * @property {ol.layer.Layer} layer The layer for which the event was raised
 * @property {HTMLElement} element The element for which the event was raised
 */

/**
 * Control to control layer interactivity
 *
 * @extends {module:ol.control.Control}
 * @abstract
 */
class AbstractLayerRelatedControl extends Control {
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
   * @returns The layers from the map as an array
   */
  get layersFromMap() {
    return Object.entries(this.layerMap);
  }

  /**
   * Creates a new abstract layer related control
   *
   * @param {LayerRelatedControlOptions} options
   * The options
   */
  constructor(options) {
    const { controlOptions, layerMapOptions } = options;

    super(controlOptions);

    const o = layerMapOptions || {};
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

    // Create an event listener for the element
    /**
     * Event listener
     */
    const listener = (originalEvent) => {
      this.handleLayerInteraction({ originalEvent, key, layer, element: e });
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

  /**
   * Handles the layer interaction
   * @param {LayerActionEventArgs} e The event arguments
   */
  handleLayerInteraction() {
    throw new Error('Not implemented');
  }
}

export default AbstractLayerRelatedControl;
