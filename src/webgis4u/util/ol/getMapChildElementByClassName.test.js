import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';
import { getMapChildElementByClassName } from './getMapChildElementByClassName';

/**
 * @typedef {Object} DebounceSetupResult
 * @property {Function} mockFunction The mock function
 * @property {number} wait The time with which the debounce function was called
 * @property {Function} debouncedFunction The debounced function
 */

describe('webgis4u/util/ol/getMapChildElementByClassName', () => {
  let mapWrapper;
  let map;

  beforeEach(() => {
    // Prepare layers
    const layers = createLayers({ count: 1 });
    // Prepare map
    map = createMap({ layers });
    // mapWrapper = document.getElementById('mock-map');
    mapWrapper = map.getTargetElement();
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  it('should return the element', () => {
    const className = 'mock-class';
    // Prepare mock element
    const elementToFind = document.createElement('div');
    elementToFind.className = className;
    mapWrapper.appendChild(elementToFind);
    // Check result
    const r = getMapChildElementByClassName({ map, className });
    expect(r).toBe(elementToFind);
  });

  it('should return the first element', () => {
    const className = 'mock-class';
    // Prepare mock elements
    const elementToFind1 = document.createElement('div');
    const elementToFind2 = document.createElement('div');
    elementToFind1.className = className;
    elementToFind2.className = className;
    mapWrapper.appendChild(elementToFind1);
    mapWrapper.appendChild(elementToFind2);
    // Check result
    const r = getMapChildElementByClassName({ map, className });
    expect(r).toBe(elementToFind1);
  });

  describe('should return null', () => {
    it('when map is null', () => {
      const r = getMapChildElementByClassName({ map: null, className: 'mock' });
      expect(r).toBe(null);
    });
    it('when map is undefined', () => {
      const r = getMapChildElementByClassName({ map: undefined, className: 'mock' });
      expect(r).toBe(null);
    });
    it('when no element exists inside map', () => {
      const className = 'mock-class';
      // Prepare mock element
      const elementToFind = document.createElement('div');
      elementToFind.className = className;
      document.getElementsByTagName('body')[0].appendChild(elementToFind);
      // Check result
      const r = getMapChildElementByClassName({ map, className });
      expect(r).toBe(null);
    });
  });
});
