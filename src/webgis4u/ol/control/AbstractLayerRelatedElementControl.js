/**
 * @module webgis4u/ol/control/AbstractLayerRelatedElementControl
 */

import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

/**
 * Control to control layer interactivity
 *
 * @extends {module:webgis4u/ol/control/AbstractLayerRelatedControl~AbstractLayerRelatedControl}
 * @abstract
 */
class AbstractLayerRelatedElementControl extends AbstractLayerRelatedControl {
  /**
   * @inheritdoc
   */
  registerListener(o) {
    const { element, listener } = o;
    element.addEventListener('click', listener, false);
  }

  /**
   * @inheritdoc
   */
  unregisterListener(o) {
    const { key, listener } = o;
    const e = document.getElementById(key);
    if (e) {
      // Remove the listener
      e.removeEventListener('click', listener, false);
    }
  }
}

export default AbstractLayerRelatedElementControl;
