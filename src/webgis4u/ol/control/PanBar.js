/**
 * @module webgis4u/ol/control/PanBar
 */

import Control from 'ol/control/Control';
import { listen } from 'ol/events';
import EventType from 'ol/events/EventType';

import { createElement } from '../../util/dom/createElement';
import { pan } from '../../util/ol/pan';

import { CSS_CONTROL_UNSELECTABLE, CSS_CONTROL_PREFIX } from './common';
import './PanBar/PanBar.scss';

/**
 * @typedef PanBarConstructorOptions
 * @property {*} target The target
 */

/**
 * Enum describing the pan direction
 * @readonly
 * @enum {number}
 */
const PanDirectionEnum = {
  Up: 1,
  Right: 2,
  Down: 3,
  Left: 4,
};
Object.freeze(PanDirectionEnum);

/**
 * The root CSS class
 */
const CSS_CLASS = `${CSS_CONTROL_PREFIX}-panbar`;

/**
 * Control for panning
 *
 * @extends {ol.control.Control}
 */
class PanBar extends Control {
  /**
   * The default pan factor
   */
  delta = 0.4;

  /**
   * Constructor
   * @param {PanBarConstructorOptions} options The options
   */
  constructor(options) {
    const opts = options || {};

    const element = createElement({
      tag: 'div',
      cssClass: `${CSS_CLASS} ${CSS_CONTROL_UNSELECTABLE}`,
    });

    super({
      element,
      target: opts.target,
    });

    this.setupDom(element);
  }

  /**
   * Set up the DOM for the control
   *
   * @param {HTMLElement} rootElement
   *
   * @private
   */
  setupDom(rootElement) {
    const tag = 'div';
    const className = `${CSS_CLASS}-pan`;

    // Create elements
    const pU = createElement({ tag, cssClass: `${className} ${className}-up` });
    const pD = createElement({ tag, cssClass: `${className} ${className}-down` });
    const pL = createElement({ tag, cssClass: `${className} ${className}-left` });
    const pR = createElement({ tag, cssClass: `${className} ${className}-right` });

    // Set up the DOM
    rootElement.appendChild(pU);
    rootElement.appendChild(pL);
    rootElement.appendChild(pR);
    rootElement.appendChild(pD);

    // Add the event listeners
    listen(pU, EventType.CLICK, this.handlePanUp);
    listen(pD, EventType.CLICK, this.handlePanDown);
    listen(pL, EventType.CLICK, this.handlePanLeft);
    listen(pR, EventType.CLICK, this.handlePanRight);
  }

  /**
   * Pans the displayed map into the passed direction
   * @param {number} deltaX The factor panned on the x axis
   * @param {number} deltaY The factor panned on the y axis
   *
   * @private
   */
  pan(deltaX, deltaY) {
    pan({
      delta: [deltaX, deltaY],
      map: this.getMap(),
    });
  }

  /**
   * Pan towards the passed direction
   * @param {PanDirectionEnum} direction The direction
   *
   * @private
   */
  panInDirection(direction) {
    switch (direction) {
      case PanDirectionEnum.Left: this.pan(-this.delta, 0); break;
      case PanDirectionEnum.Right: this.pan(this.delta, 0); break;

      case PanDirectionEnum.Up: this.pan(0, this.delta); break;
      case PanDirectionEnum.Down: this.pan(0, -this.delta); break;

      default: throw new Error('Direction is not defined');
    }
  }

  // ====================================================================================
  // Event handling
  // ====================================================================================
  handlePanUp = (e) => {
    e.preventDefault();
    this.panInDirection(PanDirectionEnum.Up);
  }

  handlePanDown = (e) => {
    e.preventDefault();
    this.panInDirection(PanDirectionEnum.Down);
  }

  handlePanLeft = (e) => {
    e.preventDefault();
    this.panInDirection(PanDirectionEnum.Left);
  }

  handlePanRight = (e) => {
    e.preventDefault();
    this.panInDirection(PanDirectionEnum.Right);
  }
}

export default PanBar;
