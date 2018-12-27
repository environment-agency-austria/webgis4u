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

  /**
   * @inheritdoc
   */
  onLayerInteractionAdded({ element, layer }) {
    const e = element;
    e.checked = layer.getVisible();
  }

  /**
   * @inheritdoc
   */
  handleLayerInteraction(e) {
    const { layer, element } = e;
    layer.setVisible(element.checked);
  }
}

export default LayerCheckbox;
