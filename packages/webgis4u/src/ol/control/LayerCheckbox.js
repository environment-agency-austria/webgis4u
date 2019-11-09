/**
 * @module webgis4u/ol/control/LayerCheckbox
 */

import { createElement } from '../../util/dom/createElement';
import AbstractLayerRelatedElementControl from './AbstractLayerRelatedElementControl';

/**
 * @typedef LayerCheckboxOptions
 * @type {LayerMap}
 */

/**
 * Control to control layer visibility
 *
 * @extends {module:webgis4u/ol/control/AbstractLayerRelatedElementControl~AbstractLayerRelatedElementControl}
 */
class LayerCheckbox extends AbstractLayerRelatedElementControl {
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
