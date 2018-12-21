/**
 * @module webgis4u/ol/control/LayerCheckbox
 */

import Layer from 'ol/layer/Layer';

import { createElement } from '../../util/dom/createElement';
import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

/**
 * @typedef LayerCheckboxOptions
 * @type {LayerMap}
 */

/**
 * Control to control layer visibility
 *
 * @extends {module:ol.control.Control}
 */
class LayerCheckbox extends AbstractLayerRelatedControl {
  /**
   * Creates a new LayerCheckbox
   *
   * @param {LayerCheckboxOptions} layerMapOptions
   * The options
   */
  constructor(layerMapOptions) {
    const element = createElement({ tag: 'div' });

    super({
      layerMapOptions,
      controlOptions: {
        element,
        target: null,
      },
    });
  }

  addInteraction(key, layer) {
    super.addInteraction(key, layer);

    // Check if a valid layer was passed
    if (!layer || !(layer instanceof Layer)) { return; }

    // Look for the element
    const e = document.getElementById(key);
    if (!e) { return; }

    // Update the element checked state accordingly
    e.checked = layer.getVisible();
  }

  handleLayerInteraction(e) {
    const { layer, element } = e;
    layer.setVisible(element.checked);
  }
}

export default LayerCheckbox;
