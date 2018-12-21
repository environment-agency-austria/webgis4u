import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import LayerCheckbox from './LayerCheckbox';

describe('webgis4u/ol/control/LayerCheckbox', () => {
  const mockElementId = 'mock-element-id';
  let mockElement;
  let map;
  let control;
  let layers;

  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new LayerCheckbox(options);
    map.addControl(control);
  };
  /**
   * Set up the control for use with layers
   */
  const setupControlForLayer = (options) => {
    const defaultOptions = {};
    defaultOptions[mockElementId] = map.getLayers().item(0);

    const o = {
      ...defaultOptions,
      ...options,
    };

    setupControl(o);
  };

  beforeEach(() => {
    // Prepare a mock element and append it
    mockElement = document.createElement('input');
    mockElement.id = mockElementId;
    document.getElementsByTagName('body')[0].appendChild(mockElement);
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
    mockElement = null;
  });

  it('should contain control', () => {
    setupControl();
    expect(map.getControls().getArray()).toContain(control);
  });

  describe('should register', () => {
    it('for layer', () => {
      setupControlForLayer();
      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(1);
    });

    it('and re-register', () => {
      setupControlForLayer();
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(1);
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
        options[mockElementId] = value;
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
      expect(registeredListeners.length).toBe(1);
    });

    it('should not remove event listeners', () => {
      // Set up with an ID that does not exist
      setupControlForLayer({
        'mock-nonexisting-id': map.getLayers().item(0),
      });
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(1);
    });

    it('should not remove HTML event listeners', () => {
      setupControlForLayer();
      // Make the element no longer available by its ID
      document.getElementById(mockElementId).parentElement.innerHTML = '';
      expect(document.getElementById(mockElementId)).toBe(null);

      // Re set the map
      control.setMap(map);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });
  });

  describe('shoud interact', () => {
    let layer;
    const mockGetVisible = jest.fn();
    const mockSetVisible = jest.fn();
    /**
     * Set up control with a fake layer
     */
    const setupWithMockLayer = () => {
      layer = map.getLayers().item(0);
      layer.getVisible = mockGetVisible;
      layer.setVisible = mockSetVisible;

      const controlOptions = {};
      controlOptions[mockElementId] = layer;
      setupControl(controlOptions);
    };

    afterEach(() => {
      mockGetVisible.mockClear();
      mockSetVisible.mockClear();
    });

    it('and set checked to false', () => {
      mockGetVisible.mockImplementationOnce(() => false);
      setupWithMockLayer();

      expect(mockGetVisible).toBeCalledTimes(1);
      expect(mockElement.checked).toBe(false);
    });

    it('and set checked to true', () => {
      mockGetVisible.mockImplementationOnce(() => true);
      setupWithMockLayer();

      expect(mockGetVisible).toBeCalledTimes(1);
      expect(mockElement.checked).toBe(true);
    });

    it('and set checked on event', () => {
      // Set up
      mockGetVisible.mockImplementationOnce(() => false);
      setupWithMockLayer();

      // Simulate click event
      const expected = true;
      mockElement.checked = expected;
      mockElement.dispatchEvent(new Event('click'));

      // Check result
      expect(mockSetVisible).toBeCalledWith(expected);
    });
  });
});
