import { disposeMap, createMap, createLayers } from '../../../test/utils/ol';

import AbstractLayerRelatedControl from './AbstractLayerRelatedControl';

describe('webgis4u/ol/control/AbstractLayerRelatedControl', () => {
  const mockElement1Id = 'mock-element-id-1';
  const mockElement2Id = 'mock-element-id-2';
  let mockElement1;
  let mockElement2;
  let map;
  let control;
  let layers;

  /**
   * Set up the control
   */
  const setupControl = (options) => {
    const element = document.createElement('div');
    const o = {
      ...options,
      controlOptions: {
        ...options.controlOptions,
        element,
      },
    };
    control = new AbstractLayerRelatedControl(o);
    map.addControl(control);
  };
  /**
   * Set up the control for use with layers
   */
  const setupControlForLayer = (options) => {
    const defaultOptions = {};
    defaultOptions[mockElement1Id] = map.getLayers().item(0);
    defaultOptions[mockElement2Id] = map.getLayers().item(1);

    const o = {
      ...defaultOptions,
      ...options,
    };

    setupControl({
      layerMapOptions: o,
    });
  };

  beforeEach(() => {
    // Prepare mock elements
    mockElement1 = document.createElement('input');
    mockElement1.id = mockElement1Id;
    mockElement2 = document.createElement('input');
    mockElement2.id = mockElement2Id;
    // ...and append them
    document.getElementsByTagName('body')[0].appendChild(mockElement1);
    document.getElementsByTagName('body')[0].appendChild(mockElement2);
    // Prepare layers
    layers = createLayers({ count: 2 });
    // Prepare map
    map = createMap({ layers });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
    mockElement1 = null;
    mockElement2 = null;
  });

  it('should contain control', () => {
    setupControl({});
    expect(map.getControls().getArray()).toContain(control);
  });

  describe('should register', () => {
    it('for layer', () => {
      setupControlForLayer();
      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(2);
    });

    it('and re-register', () => {
      setupControlForLayer();
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(2);
    });

    it('and unregister', () => {
      setupControlForLayer();
      control.setMap(null);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });

    describe('only with valid layers', () => {
      /**
       * Set up control without a valid layer
       */
      const setupWithNonLayer = (value) => {
        const options = {};
        options[mockElement1Id] = value;
        // Also make sure that we unset the value for
        // the second mock element
        options[mockElement2Id] = undefined;
        setupControlForLayer(options);
      };

      const testCases = [
        ['null', null],
        ['undefined', undefined],
        ['number (0)', 0],
        ['string ("something")', 'something'],
      ];

      test.each(testCases)('and not %s', (name, value) => {
        setupWithNonLayer(value);
        const registeredListeners = Object.keys(control.listeners);
        expect(registeredListeners.length).toBe(0);
      });
    });
  });

  describe('with non-existend HTML IDs', () => {
    it('should not register listeners', () => {
      // Set up with an ID that does not exist
      setupControlForLayer({
        'mock-nonexisting-id': map.getLayers().item(0),
      });

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(2);
    });

    it('should not remove event listeners', () => {
      // Set up with an ID that does not exist
      setupControlForLayer({
        'mock-nonexisting-id': map.getLayers().item(0),
      });
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(2);
    });

    it('should not remove HTML event listeners', () => {
      setupControlForLayer();
      // Make the element no longer available by its ID
      document.getElementById(mockElement1Id).parentElement.innerHTML = '';
      expect(document.getElementById(mockElement1Id)).toBe(null);

      // Re set the map
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });
  });
});
