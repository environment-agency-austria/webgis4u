import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import LayerRadioButton from './LayerRadioButton';

describe('webgis4u/ol/control/LayerRadioButton', () => {
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
    control = new LayerRadioButton(options);
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
  });


  describe('shoud interact', () => {
    let layer1;
    let layer2;
    /**
     * Set up control with a fake layer
     */
    const setupWithMockLayer = () => {
      layer1 = map.getLayers().item(0);
      layer2 = map.getLayers().item(1);
      // Set mocks for layer 1
      layer1.getVisible = jest.fn();
      layer1.setVisible = jest.fn();
      // Set mocks for layer 2
      layer2.getVisible = jest.fn();
      layer2.setVisible = jest.fn();

      const layerMapOptions = {};
      layerMapOptions[mockElement1Id] = layer1;
      layerMapOptions[mockElement2Id] = layer2;
      setupControl({ layerMapOptions });
    };

    afterEach(() => {
      // Clear mocks layer 1
      layer1.getVisible.mockClear();
      layer1.setVisible.mockClear();
      // Clear mocks layer 2
      layer2.getVisible.mockClear();
      layer2.setVisible.mockClear();
    });

    it('and set checked on event', () => {
      // Set up
      setupWithMockLayer();

      // Simulate click event
      const expected = true;
      mockElement1.checked = expected;
      mockElement1.dispatchEvent(new Event('click'));

      // Check result
      expect(layer1.setVisible).toBeCalledWith(expected);
      expect(layer2.setVisible).toBeCalledWith(!expected);
    });
  });
});
