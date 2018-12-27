/**
 * @module webgis4u/ol/control/LayerCheckbox
 */

import { createElement } from '../../util/dom/createElement';
import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

/**
 * @typedef LayerVisibilityOptions
 * @type {module:webgis4u/ol/control/AbstractLayerRelatedControl~LayerRelatedControlOptions}
 * @property {string} styleValueVisible The value when the layer is visible
 * @property {string} styleValueHidden The value when the layer is not visible
 */

/**
 * Control to control layer visibility
 *
 * @extends {module:webgis4u/ol/control/AbstractLayerRelatedControl~AbstractLayerRelatedControl}
 */
class LayerVisibility extends AbstractLayerRelatedControl {
  /**
   *
   */
  styleValueVisible = 'block';

  /**
   *
   */
  styleValueHidden = 'none';

  /**
   * Creates a new LayerCheckbox
   *
   * @param {LayerVisibilityOptions} options
   * The options
   */
  constructor(options) {
    const element = createElement({ tag: 'div' });

    const {
      controlOptions,
      layerMapOptions,
      ...otherOptions
    } = options;

    super({
      layerMapOptions,
      controlOptions: {
        ...controlOptions,
        element,
      },
    });

    if (otherOptions.styleValueVisible) {
      this.styleValueVisible = otherOptions.styleValueVisible;
    }
    if (otherOptions.styleValueHidden) {
      this.styleValueHidden = otherOptions.styleValueHidden;
    }
  }

  /**
   * @inheritdoc
   */
  registerListener(o) {
    const { layer, listener } = o;
    layer.on('change:visible', listener);
  }

  /**
   * @inheritdoc
   */
  unregisterListener(o) {
    const { key, listener } = o;
    const layer = this.layerMap[key];
    layer.un('change:visible', listener, false);
  }

  /**
   * @inheritdoc
   */
  onLayerInteractionAdded(options) {
    this.updateLayerStyle(options);
  }

  /**
   * @inheritdoc
   */
  handleLayerInteraction(e) {
    this.updateLayerStyle(e);
  }

  /**
   * @private
   */
  updateLayerStyle(options) {
    const { element, layer } = options;
    element.style.display = this.getDisplayStyleForLayer(layer);
  }

  /**
   * @private
   */
  getDisplayStyleForLayer(layer) {
    return (layer.getVisible())
      ? this.styleValueVisible
      : this.styleValueHidden;
  }
}

export default LayerVisibility;
