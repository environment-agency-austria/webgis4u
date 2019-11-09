/**
 * @module webgis4u/components/AutoComplete
 */
import { createElement } from '../util/dom/createElement';
import KeyCodeEnum from '../util/dom/KeyCodeEnum';
import { PromiseStateEnum, state as promiseState } from '../util/promise/state';

import './AutoComplete/AutoComplete.scss';

/**
 * @callback OnItemHoverCallback
 * @param {Event} The original event
 * @param {any} choice The choice that was hovered
 */

/**
 * @callback OnItemSelectCallback
 * @param {Event} event The original event
 * @param {any} choice The choice that was hovered
 */

/**
 * @callback OnListUpdatedCallback
 * @param {Event} event The original event
 * @param {Array<any>} choices The choices
 */

const CSS_CLASS = 'autocomplete';
const CSS_CLASS_ACTIVE = `${CSS_CLASS}-active`;
const CSS_CLASS_LIST = `${CSS_CLASS}-items`;

/**
 * close all autocomplete lists in the document
 * except the one passed as an argument
 *
 * @param {*} element The element that should not be closed
 */
function closeAllLists(element) {
  // Convert 'live' list to array and loop it
  [...document.getElementsByClassName(CSS_CLASS_LIST)].forEach((e) => {
    if (element !== e && element !== e.parentNode) {
      e.parentNode.removeChild(e);
    }
  });
}

// execute a function when someone clicks in the document
document.addEventListener('click', (e) => {
  closeAllLists(e.target);
});

/**
 * @typedef Options
 * @type {object}
 * @property {HTMLElement} element
 * @property {number} [minLength=0] The minimum length at which the search is executed
 * @property {string} [placeholder] The placeholder text
 * @property {Function} [getChoiceText] Function that is executed with one list item and returns the text
 * @property {module:webgis4u/components/AutoComplete~OnItemHoverCallback} [onItemHover]
 * @property {module:webgis4u/components/AutoComplete~OnItemSelectCallback} [onItemSelected]
 */

/**
 * Creates an auto complete able input element
 */
class AutoComplete {
  /**
   * @type {HTMLInputElement}
   * The input element
   */
  element;

  /**
   * @type {HTMLElement|null}
   * The list element that will contain the items (values)
   */
  list = null;

  /**
   * @type {number}
   * The currently focused
   */
  currentFocus;

  /**
   * @type {Array}
   */
  choices = [];

  /**
   * @type {Array<any>}
   * Array containing the choices that were filtered
   */
  filteredChoices = [];

  /**
   * @type {Function|null}
   */
  _getChoiceText = null;

  /**
   * @type {null|module:webgis4u/components/AutoComplete~OnItemSelectCallback}
   * Callback for on Select
   */
  onItemSelected = null;

  /**
   * @type {null|module:webgis4u/components/AutoComplete~OnItemHoverCallback}
   * Callback for on hover
   */
  onItemHover = null;

  /**
   * @type {null|module:webgis4u/components/AutoComplete~OnListUpdatedCallback}
   * Callback for on hover
   */
  _onListUpdated = null

  /**
   * @type {string}
   * Message that is shown when no search results are found
   */
  messageNotFound = '';

  /**
   * @type {string}
   * Message that is shown while search is pending
   */
  messagePending = '';

  /**
   * @type {Array<any>|Function}
   * The source to provide the choices.
   * Can be an array or a function
   */
  source;

  /**
   * @type {number|null}
   */
  limit = null;

  /**
   * Constructor
   * @param {Options}
   */
  constructor(options) {
    this.element = options.element;

    this.minLength = options.minLength || 0;
    this.limit = options.limit || null;
    this.placeholder = options.placeholder;

    this.source = options.source;
    this._getChoiceText = options.getChoiceText || null;
    this.onItemSelected = options.onItemSelected || null;
    this.onItemHover = options.onItemHover || null;
    this._onListUpdated = options.onListUpdated || null;

    // Set up the messages
    const { notFound, pending } = options.messages || {};
    this.messageNotFound = notFound || '';
    this.messagePending = pending || '';

    this.init();
  }

  init() {
    this.initWrapper();
    this.initElement();
  }

  initWrapper() {
    this.wrapper = createElement({
      tag: 'span',
      cssClass: CSS_CLASS,
    });

    const {
      element,
      element: {
        parentNode,
      },
    } = this;

    parentNode.insertBefore(this.wrapper, element);
    this.element = this.wrapper.insertBefore(element, null);
  }

  /**
   * Initializes the element
   * @private
   */
  initElement() {
    const {
      element,
    } = this;
    let {
      placeholder,
    } = this;

    // Read values from element
    placeholder = placeholder || element.getAttribute('placeholder');

    // Set element values
    element.setAttribute('type', 'text');
    element.setAttribute('placeholder', placeholder);
    element.addEventListener('input', this.handleOnInput);
    element.addEventListener('keydown', this.handleOnKeydown);
  }

  /**
   * @param {any} choice The choice
   * @returns {string} The text for the choice
   * @private
   */
  getChoiceText(choice) {
    return (this._getChoiceText)
      ? this._getChoiceText(choice)
      : choice;
  }

  /**
   * Acquires the data
   * @param {string} query The entered query
   * @private
   */
  async getSource(query) {
    if (Array.isArray(this.source)) {
      const regex = new RegExp(query, 'i');

      return this.source.filter(choice => regex.test(this.getChoiceText(choice)));
    }

    if (typeof (this.source) === 'function') {
      return this.source(query);
    }

    throw new TypeError('Source must be an array or an function');
  }

  /**
   * Set the current element in the list active
   *
   * @param {HTMLCollection} listItems
   * @private
   */
  addActive(listItems) {
    this.removeActive(listItems);
    if (this.currentFocus >= listItems.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (listItems.length - 1);

    const element = listItems[this.currentFocus];
    element.classList.add(CSS_CLASS_ACTIVE);
    const choice = this.filteredChoices[this.currentFocus];

    if (this.onItemHover) {
      this.onItemHover(null, choice);
    }
  }

  /**
   * a function to remove the "active" class from all autocomplete items
   *
   * @param {HTMLCollection} listItems
   * @private
   */
  removeActive(listItems) {
    [...listItems].forEach((e) => {
      e.classList.remove(CSS_CLASS_ACTIVE);
    });
  }

  /**
   * Creates the list item for the given choice
   * @param {any} choice The choice for which the list item should be creates
   * @returns {HTMLElement}
   * @private
   */
  createListItem(choice) {
    const choiceValue = this.getChoiceText(choice);
    const b = document.createElement('div');
    b.setAttribute('data-value', choiceValue);
    b.innerText = choiceValue;
    // execute a function when someone clicks on the item value (DIV element)
    b.addEventListener('click', (event) => {
      this.onListItemClicked(event, choice, choiceValue);
    });
    b.addEventListener('mouseover', (event) => {
      this.onItemHover(event, choice);
    });

    return b;
  }

  /**
   * Creates the element that shows the pending state
   * @returns {HTMLElement}
   * @private
   */
  createPending() {
    const b = document.createElement('div');
    const text = this.messagePending || '...';
    b.innerHTML = `<i>${text}</i>`;
    return b;
  }

  /**
   * Event for the onClick event on a specific list item
   * @param {Event} event The triggered event
   * @param {any} choice The choice that was clicked
   * @param {string} choiceValue The value shown as text for the choice
   * @private
   */
  onListItemClicked = (event, choice, choiceValue) => {
    // insert the value for the autocomplete text field
    this.element.value = choiceValue;

    if (this.onItemSelected) {
      this.onItemSelected(event, choice);
    }
    // close the list of autocompleted values,
    // (or any other open lists of autocompleted values
    closeAllLists();
  }

  /**
   * Triggers the onListUpdate callback
   * @param {Array} choices The choices shown in the list
   * @private
   */
  onListUpdated(choices) {
    if (this._onListUpdated) {
      this._onListUpdated(choices);
    }
  }

  /**
   * Updates the list
   * @param {string} value
   */
  async updateList(value) {
    // If value does not have any value, do nothing
    if (!value) { return; }

    const { element } = this;

    this.currentFocus = -1;
    // Create list and store local reference
    this.list = createElement({
      tag: 'div',
      cssClass: CSS_CLASS_LIST,
    });

    // append the DIV element as a child of the autocomplete container
    element.parentNode.appendChild(this.list);

    // Acquire the data
    const MaybeResolved = this.getSource(value);
    if (await promiseState(MaybeResolved) === PromiseStateEnum.Pending) {
      this.list.appendChild(
        this.createPending(),
      );
    }

    // Wait for the data
    this.filteredChoices = await MaybeResolved;
    this.list.innerHTML = '';

    // Add the not found if there are no choices
    if (this.filteredChoices.length === 0) {
      const notFoundElement = document.createElement('div');
      notFoundElement.innerHTML = this.messageNotFound;
      this.list.appendChild(notFoundElement);
      this.onListUpdated(this.filteredChoices);
      return;
    }

    // Limit the list of results
    if (this.limit !== null) {
      this.filteredChoices = this.filteredChoices.filter(
        (o, index) => index < this.limit,
      );
    }

    // And finally add the found choices
    this.filteredChoices.forEach((choice) => {
      this.list.appendChild(
        this.createListItem(choice),
      );
    });

    // Finally notify for list update
    this.onListUpdated(this.filteredChoices);
  }

  /**
   * Event listener for the input changed event
   * @private
   */
  handleOnInput = () => {
    const {
      element: {
        value,
      },
    } = this;

    // close any already open lists of autocompleted values
    closeAllLists();
    this.updateList(value);
  }

  /**
   * Event listener for the input keydown event
   * @private
   */
  handleOnKeydown = (e) => {
    const { filteredChoices, list } = this;
    if (!filteredChoices || filteredChoices.length === 0) { return; }
    if (!list) { return; }
    const listItems = list.getElementsByTagName('div');
    if (listItems.length === 0) { return; }

    // Everything we need is available

    const { keyCode } = e;
    if (keyCode === KeyCodeEnum.ARROW_DOWN) {
      // Focus next item
      this.currentFocus += 1;
      this.addActive(listItems);
    } else if (keyCode === KeyCodeEnum.ARROW_UP) {
      // Focus previous item
      this.currentFocus -= 1;
      this.addActive(listItems);
    } else if (keyCode === KeyCodeEnum.ENTER) {
      // Prevent forms from being submitted
      e.preventDefault();
      if (this.currentFocus > -1) {
        // Simulate click on the active element
        listItems[this.currentFocus].click();
      }
    }
  }
}

export default AutoComplete;
