import './style.scss';
import Prism from 'prismjs';
import ExampleMap from './ExampleMap';

/**
 * Callback that is called when the module is successfully loaded
 *
 * @param {ExampleModule} module The module that was loaded
 */
function onExampleModuleLoaded(module) {
  const mapConfig = {
    target: 'map',
  };
  module.initialize(mapConfig);
}

/**
 * Show the source code on the site
 * @param {string} code The source code
 */
function showSourceCode(code) {
  // Since the code comes compiled with babel, we need to remove everything inserted by babel
  const strippedCode = code.substr(code.indexOf('import'));

  // Find the element and remove previous content
  const element = document.getElementById('source-code');
  element.innerText = '';

  // Add the code
  const codeElement = document.createElement('code');
  codeElement.append(strippedCode);
  element.appendChild(codeElement);

  // Make it pretty
  Prism.highlightAllUnder(element);
}

/**
 * Creates a navigation item for `item`
 *
 * @param {ExampleModuleLoader} item
 */
const createNavItem = (item) => {
  // Create the wrapper
  const wrapper = document.createElement('li');
  wrapper.className = 'nav-item';
  // Create the navigation link
  const element = document.createElement('a');
  element.className = 'nav-link';
  element.innerText = item.name;
  wrapper.appendChild(element);

  /**
   *
   * @param {*} e
   */
  const onClick = (e) => {
    e.preventDefault();

    showSourceCode(item.source);

    item.load()
      .then(onExampleModuleLoaded)
      .catch(error => console.error(`Example '${item.name}': Error while loading`, error));
  };

  // Add the event handler and return the element
  element.addEventListener('click', onClick);

  return wrapper;
};

/**
 * Create the navigation bar
 */
function createNav(elementId, items) {
  const e = document.getElementById(elementId);
  const element = e.firstElementChild;

  // Append children
  const itemElements = items.map(createNavItem);
  itemElements.forEach((itemELement) => {
    element.appendChild(itemELement);
  });
}

createNav('navbarNav', ExampleMap);
