/**
 * @module webgis4u/ol/control/LayerRadioButton
 */

import { createElement } from '../../util/dom/createElement';
import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

/**
 * @typedef LayerRadioButtonOptions
 * @type {LayerMap}
 */

/**
 * Control to control layer visibility
 *
 * @extends {module:ol.control.Control}
 */
class LayerRadioButton extends AbstractLayerRelatedControl {
  /**
   * Creates a new LayerCheckbox
   *
   * @param {LayerRelatedControlOptions} options
   * The options
   */
  constructor(options) {
    const element = createElement({ tag: 'div' });

    super({
      ...options,
      controlOptions: {
        ...options.controlOptions,
        element,
      },
    });
  }

  /**
   * @inheritdoc
   */
  handleLayerInteraction(e) {
    const { layer, element } = e;

    this.layersFromMap.forEach(([, layerFromMap]) => {
      if (!layerFromMap) { return; }
      // only if the layer is defined
      const visible = (layer === layerFromMap)
        ? element.checked
        : !element.checked;

      layerFromMap.setVisible(visible);
    });
  }
}

export default LayerRadioButton;
