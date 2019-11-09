/**
 * @module webgis4u/util/dom/createElement
 */

import { hasValue } from '../string/hasValue';

/**
 * @typedef CreateHtmlElementOptions
 * @property {string} tag - The tag
 * @property {string} [cssClass] - The class of the element
 */

/**
 * Util function to create a HTML element
 *
 * @param {module:webgis4u/util/dom/createElement~CreateHtmlElementOptions} options
 * The options
 *
 * @returns {HTMLElement} An html element
 */
export function createElement(options) {
  const {
    tag, cssClass,
    width, height,
  } = options;

  // Check if a valid tag was passed
  if (!hasValue(tag)) {
    throw new TypeError('tag must be a valid HTML tag');
  }

  // Create the element
  const e = document.createElement(tag);

  // Add css class
  if (cssClass) { e.className = cssClass; }

  // Set the size
  if (typeof (width) === 'string') { e.style.width = width; }
  if (typeof (height) === 'string') { e.style.height = height; }

  return e;
}
