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
 * @typedef UnregisterListenerOptions
 * @type {object}
 * @property {string} key The identifier for the layer
 * @property {Function} listener The listener related to the layer identifier
 */

/**
 * @typedef RegisterListenerOptions
 * @type {UnregisterListenerOptions}
 * @property {ol.layer.Layer} layer The layer for which the event was added
 * @property {HTMLElement} element The element for which the event was added
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
    const element = document.getElementById(key);
    if (!element) { return; }

    // Create an event listener for the element
    /**
     * Event listener
     */
    const listener = (originalEvent) => {
      this.handleLayerInteraction({ originalEvent, key, layer, element });
    };

    // Prepare the layer interaction options
    const layerInteractionOptions = {
      element,
      listener,
      layer,
      key,
    };

    // Store the created listener
    this.listeners[key] = listener;
    // Register the listener
    this.registerListener(layerInteractionOptions);
    // And call added
    this.onLayerInteractionAdded(layerInteractionOptions);
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

    this.unregisterListener({ key, listener });

    // Remove the listener
    delete this.listeners[key];
  }

  /**
   * Handles the layer interaction
   * @param {LayerActionEventArgs} e The event arguments
   *
   * @abstract
   */
  handleLayerInteraction() {
    throw new Error('Not implemented');
  }

  /**
   * Called when an layer interaction was added
   * @param {RegisterListenerOptions} options The options
   */
  onLayerInteractionAdded() { }

  /**
   * Registers the listener
   * @param {RegisterListenerOptions} options
   *
   * @abstract
   */
  registerListener() { }

  /**
   * Unregisters the listener
   * @param {UnregisterListenerOptions} options
   *
   * @abstract
   */
  unregisterListener() { }
}

export default AbstractLayerRelatedControl;
