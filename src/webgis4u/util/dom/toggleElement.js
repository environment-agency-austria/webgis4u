/**
 * @module webgis4u/util/dom/toggleElement
 */

/**
 * The attribute to use for toggling
 *
 * see styling therefore 'scss/mixins/_attributes.scss'
 */
const ATTRIBUTE = 'data-visible';

/**
 * @param {HTMLElement} element The element
 * @returns {boolean|undefined} `true` if the element is toggled
 */
export function getToggledAttribute(element) {
  const value = element.getAttribute(ATTRIBUTE);

  switch (value) {
    case 'true': return true;
    case 'false': return false;
    default: return undefined;
  }
}

/**
 * @param {HTMLElement} element The element
 * @returns {boolean} `true` if the element is toggled
 */
export function isElementToggled(element) {
  return getToggledAttribute(element) === true;
}

/**
 *
 * @param {HTMLElement} element The element to toggle
 * @param {boolean} [toggle] Will toggle according to the value. If no value is provided, the current value will be inverted
 */
export function toggleElement(element, toggle) {
  const isVisible = (typeof (toggle) === 'boolean')
    ? toggle
    : !isElementToggled(element);

  element.setAttribute(ATTRIBUTE, isVisible);
}
