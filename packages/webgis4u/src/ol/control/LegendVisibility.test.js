import { disposeMap, createMap, createLayers } from '../../../test/utils/ol';

import LegendVisibility from './LegendVisibility';

describe('webgis4u/ol/control/LegendVisibility', () => {
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
    control = new LegendVisibility(options);
    map.addControl(control);
  };

  let layer1;
  let layer2;
  /**
   * Set up control with a fake layer
   */
  const setupWithMockLayer = (otherOptions) => {
    layer1 = map.getLayers().item(0);
    layer2 = map.getLayers().item(1);

    const layerMapOptions = {};
    layerMapOptions[mockElement1Id] = layer1;
    layerMapOptions[mockElement2Id] = layer2;
    setupControl({
      layerMapOptions,
      ...otherOptions,
    });
  };

  beforeEach(() => {
    // Prepare mock elements
    mockElement1 = document.createElement('div');
    mockElement1.id = mockElement1Id;
    mockElement2 = document.createElement('div');
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
      setupWithMockLayer();
      control.setMap(null);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });
  });

  describe('shoud update element', () => {
    it('initial', () => {
      layers[0].setVisible(true);
      layers[1].setVisible(false);

      // Set up
      setupWithMockLayer();

      // Check result
      expect(mockElement1.style.display).toBe(control.styleValueVisible);
      expect(mockElement2.style.display).toBe(control.styleValueHidden);
    });

    it('initial with custom style values', () => {
      layers[0].setVisible(true);
      layers[1].setVisible(false);

      const styleValueVisible = 'inline-block';
      const styleValueHidden = 'table';

      // Set up
      setupWithMockLayer({
        styleValueVisible,
        styleValueHidden,
      });

      // Check result
      expect(mockElement1.style.display).toBe(styleValueVisible);
      expect(mockElement2.style.display).toBe(styleValueHidden);
    });

    it('on layer visibility change', () => {
      layers[0].setVisible(true);
      layers[1].setVisible(false);
      // Setup and unset the layer map entries
      setupWithMockLayer();

      expect(mockElement1.style.display).toBe(control.styleValueVisible);
      expect(mockElement2.style.display).toBe(control.styleValueHidden);

      // Update layer visibility
      layer1.setVisible(false);
      expect(mockElement1.style.display).toBe(control.styleValueHidden);
      expect(mockElement2.style.display).toBe(control.styleValueHidden);

      // Update layer visibility again
      layer1.setVisible(true);
      expect(mockElement1.style.display).toBe(control.styleValueVisible);
      expect(mockElement2.style.display).toBe(control.styleValueHidden);
    });
  });
});
