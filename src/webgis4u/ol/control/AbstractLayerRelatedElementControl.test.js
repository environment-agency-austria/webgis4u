import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import AbstractLayerRelatedElementControl from './AbstractLayerRelatedElementControl';

describe('webgis4u/ol/control/AbstractLayerRelatedElementControl', () => {
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
    control = new AbstractLayerRelatedElementControl(o);
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
    it('and unregister', () => {
      setupControlForLayer();
      control.setMap(null);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });

    it('and not remove HTML event listeners when element does not exist', () => {
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

  describe('shoud interact', () => {
    let layer;
    const mockHandleLayerInteraction = jest.fn();
    /**
     * Set up control with a fake layer
     */
    const setupWithMockLayer = () => {
      layer = map.getLayers().item(0);

      const controlOptions = {};
      controlOptions[mockElement1Id] = layer;
      setupControlForLayer();
      control.handleLayerInteraction = mockHandleLayerInteraction;
    };

    afterEach(() => {
      mockHandleLayerInteraction.mockClear();
    });

    it('and throw error on abstract method call', () => {
      setupControlForLayer();

      const originalHandleLayerInteraction = control.handleLayerInteraction;
      control.handleLayerInteraction = jest.fn(() => {
        expect(originalHandleLayerInteraction).toThrow();
      });

      mockElement1.dispatchEvent(new Event('click'));
    });

    it('and interact with layer on event', () => {
      // Setup and simulate click event
      setupWithMockLayer();
      const originalEvent = new Event('click');
      mockElement1.dispatchEvent(new Event('click'));

      // Check result
      expect(mockHandleLayerInteraction).toBeCalledTimes(1);
      expect(mockHandleLayerInteraction).toBeCalledWith({
        originalEvent,
        layer,
        key: mockElement1Id,
        element: mockElement1,
      });
    });
  });
});
