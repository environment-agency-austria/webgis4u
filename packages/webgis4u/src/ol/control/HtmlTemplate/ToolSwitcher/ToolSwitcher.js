/**
 * @module webgis4u/ol/control/HtmlTemplate/ToolSwitcher
 */

import './ToolSwitcher.scss';

const CSS_TOOLBAR_SWITCH_ACTIVE_CLASS = 'active';
const CSS_CLASS = 'webgis4u-toolswitcher';
const CSS_CLASS_SLIDER = 'webgis4u-toolswitcher-sliders';
const CSS_CLASS_CONTENT = `${CSS_CLASS}-content`;
const CSS_CLASS_CONTENT_ITEM = `${CSS_CLASS_CONTENT}-item`;

/**
 * Class to provide interaction with the tool switcher
 */
class ToolSwitcher {
  /** @type {HTMLElement|null} */
  toolsSwitcherContent = null;

  /** @type {HTMLElement|null} */
  toolsSwitcherSlider = null;

  /** @type {HTMLElement|null} */
  closeButton = null;

  /**
   * @type {string|null}
   */
  activeTool = null;

  /**
   * Initialize the tool switcher
   * @param {HTMLElement} mapTargetElement The html element for the map
   */
  init(mapTargetElement) {
    this.toolsSwitcherContent = mapTargetElement.querySelector(`.${CSS_CLASS_CONTENT}`);
    this.toolsSwitcherSlider = mapTargetElement.querySelector(`.${CSS_CLASS_SLIDER}`);
    this.closeButton = mapTargetElement.querySelector(`.${CSS_CLASS}-close`);

    if (this.toolsSwitcherContent && this.closeButton) {
      this.initPanel(['map', 'functions']);
    }
  }

  /**
   * Initializes the panel
   * @param {Array<string>} toolNames The name of the tools to initialize
   * @private
   */
  initPanel(toolNames) {
    toolNames.forEach((toolName) => {
      const elements = this.getToolElements(toolName);
      if (elements) {
        elements.button.onclick = this.createListenerForTool(toolName);
      }
    });

    this.closeButton.onclick = () => {
      this.closeMenu();
      return false;
    };
  }

  /**
   * Create the onclick listener for the given tool
   * @param {string} toolName The name of the tool
   * @private
   */
  createListenerForTool(toolName) {
    return () => {
      if (this.activeTool !== toolName) {
        this.activateTool(toolName);
      } else {
        this.closeMenu();
      }

      return false;
    };
  }

  /**
   * @param {string} toolName The name of the tool
   * @returns {null|object}
   * @private
   */
  getToolElements(toolName) {
    const { toolsSwitcherContent, toolsSwitcherSlider } = this;
    if (!toolsSwitcherContent || !toolsSwitcherSlider) { return null; }

    const button = toolsSwitcherSlider.querySelector(`[data-id="${toolName}"]`);
    const content = toolsSwitcherContent.querySelector(`.${CSS_CLASS_CONTENT_ITEM}[data-id="${toolName}"]`);

    if (!button || !content) { return null; }

    return { button, content };
  }

  /**
   * Activates the tool
   * @param {string} toolName The name of the tool to activate
   * @private
   */
  activateTool(toolName) {
    const { toolsSwitcherContent } = this;
    const toolElements = this.getToolElements(toolName);
    if (!toolsSwitcherContent || !toolElements) { return; }

    this.toolsSwitcherContent.setAttribute('data-expanded', true);

    // If a tool is active, deactivate it first
    if (this.activeTool) {
      this.deactivateTool(this.activeTool);
    }

    const { button, content } = toolElements;
    button.classList.add(CSS_TOOLBAR_SWITCH_ACTIVE_CLASS);
    content.classList.add(CSS_TOOLBAR_SWITCH_ACTIVE_CLASS);

    this.activeTool = toolName;
  }

  /**
   * Deactivates the tool
   * @param {string} toolName The name of the tool to activate
   * @private
   */
  deactivateTool(toolName) {
    const toolElements = this.getToolElements(toolName);
    if (!toolElements) { return; }

    const { button, content } = toolElements;
    button.classList.remove(CSS_TOOLBAR_SWITCH_ACTIVE_CLASS);
    content.classList.remove(CSS_TOOLBAR_SWITCH_ACTIVE_CLASS);

    this.activeTool = null;
  }

  /**
   * Closes the menu
   */
  closeMenu() {
    this.deactivateTool(this.activeTool);
    this.toolsSwitcherContent.setAttribute('data-expanded', false);
  }

  /**
   * Updates the controls visibility
   * @param {object} options The options
   * @param {Array<number>} options.size The size of the map
   */
  updateControlsVisibility(options) {
    const { size: [, height] } = options;
    /* shrink the toolswitcher content */
    if (this.toolsSwitcherContent) {
      this.toolsSwitcherContent.style.maxHeight = `${height - 50}px`;
    }
  }
}

export default ToolSwitcher;
