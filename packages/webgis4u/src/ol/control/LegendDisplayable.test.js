import { disposeMap, createMap, createLayers } from '../../../test/utils/ol';

import LegendDisplayable from './LegendDisplayable';

describe('webgis4u/ol/control/LegendDisplayable', () => {
  const mockElement1Id = 'mock-element-id-1';
  const mockElement2Id = 'mock-element-id-2';
  let mockElement1;
  let mockElement2;
  let map;
  let view;
  let control;
  let layers;

  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new LegendDisplayable(options);
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
    view = map.getView();
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    view = null;
    control = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
    mockElement1 = null;
    mockElement2 = null;
  });

  describe('should create control', () => {
    it('and register control', () => {
      setupControl({});
      expect(map.getControls().getArray()).toContain(control);
    });

    it('with non-default options', () => {
      const styleIsDisplayable = { mock: 'is-displayable' };
      const styleIsNotDisplayable = { mock: 'is-not-displayable' };
      setupControl({
        styleIsDisplayable,
        styleIsNotDisplayable,
      });

      expect(control.styleIsDisplayable).toBe(styleIsDisplayable);
      expect(control.styleIsNotDisplayable).toBe(styleIsNotDisplayable);
    });
  });

  describe('should register', () => {
    it('and unregister', () => {
      setupWithMockLayer();
      control.setMap(null);

      const registeredListeners = Object.keys(control.listeners);
      expect(registeredListeners.length).toBe(0);
    });
    it('and return null if map is reset', () => {
      setupWithMockLayer();
      control.setMap(null);

      expect(control.mapView).toBe(null);
    });
  });

  describe('isLayerAvailable', () => {
    const mockLayerGetMinRes = jest.fn();
    const mockLayerGetMaxRes = jest.fn();
    const mockViewGetRes = jest.fn();

    beforeEach(() => {
      setupWithMockLayer();
      [layer1] = layers;
      layer1.getMinResolution = mockLayerGetMinRes;
      layer1.getMaxResolution = mockLayerGetMaxRes;
      view.getResolution = mockViewGetRes;
    });

    afterEach(() => {
      mockLayerGetMaxRes.mockClear();
      mockLayerGetMinRes.mockClear();
      mockViewGetRes.mockClear();
    });

    const testCases = [
      [false, Number.NEGATIVE_INFINITY],
      [false, -1],
      [false, -0.1],
      [true, 0],
      [true, 0.5],
      [true, 1],
      [false, 1.1],
      [false, 2],
      [false, Number.POSITIVE_INFINITY],
    ];

    test.each(testCases)('should return %s with res %s', (expected, viewRes) => {
      mockLayerGetMinRes.mockReturnValueOnce(0);
      mockLayerGetMaxRes.mockReturnValueOnce(1);
      mockViewGetRes.mockReturnValueOnce(viewRes);
      const r = control.isLayerAvailable(layer1, view);

      expect(r).toBe(expected);
    });
  });

  describe('setIsDisplayable', () => {
    const testCases = [
      [false],
      [true],
    ];

    test.each(testCases)('when isDisplayable=%s', (isDisplayable) => {
      setupWithMockLayer();
      const expected = (isDisplayable)
        ? control.styleIsDisplayable
        : control.styleIsNotDisplayable;

      control.updateElementStyle = jest.fn();

      control.setIsDisplayable(mockElement1, isDisplayable);

      expect(control.updateElementStyle).toBeCalledTimes(1);
      expect(control.updateElementStyle).toBeCalledWith(mockElement1, expected);
    });
  });

  describe('shoud update element', () => {
    describe('updateLayerStyle', () => {
      const mockGetMapView = jest.fn();
      const testCases = [
        [false, { hasMapView: false, element: undefined, layer: undefined }],
        [false, { hasMapView: true, element: undefined, layer: undefined }],
        [false, { hasMapView: false, element: null, layer: undefined }],
        [false, { hasMapView: true, element: null, layer: undefined }],
        [false, { hasMapView: false, element: undefined, layer: null }],
        [false, { hasMapView: true, element: undefined, layer: null }],
        [false, { hasMapView: false, element: null, layer: null }],
        [false, { hasMapView: true, element: null, layer: null }],
        [false, { hasMapView: false, element: true, layer: null }],
        [true, { hasMapView: true, element: true, layer: null }],
      ];

      beforeEach(() => {
        setupWithMockLayer();
        control.setIsDisplayable = jest.fn();
        control.isLayerAvailable = jest.fn().mockReturnValue(true);
        Object.defineProperty(control, 'mapView', {
          get: mockGetMapView,
        });
      });

      afterEach(() => {
        control.setIsDisplayable.mockClear();
        control.isLayerAvailable.mockClear();
        mockGetMapView.mockClear();
      });

      test.each(testCases)('call setIsDisplayable(%s) accordingly', (shouldCall, o) => {
        const { hasMapView, element, layer } = o;
        const expectedLayer = layer ? layer1 : layer;
        const expectedElement = element ? mockElement1 : element;
        const expectedView = hasMapView ? view : null;
        mockGetMapView.mockReturnValue(expectedView);

        control.updateLayerStyle({ element: expectedElement, layer: expectedLayer });
        expect(mockGetMapView).toBeCalled();

        if (!shouldCall) {
          expect(control.isLayerAvailable).not.toBeCalled();
          expect(control.setIsDisplayable).not.toBeCalled();
        } else {
          expect(control.isLayerAvailable).toBeCalled();
          expect(control.isLayerAvailable).toBeCalledWith(expectedLayer, expectedView);
          expect(control.setIsDisplayable).toBeCalled();
          expect(control.setIsDisplayable).toBeCalledWith(expectedElement, true);
        }
      });
    });

    it('handleLayerInteraction', () => {
      // Set up
      setupWithMockLayer();
      control.updateLayerStyle = jest.fn();
      const eventArgs = {
        element: mockElement1,
        layer: layer1,
      };

      // Invoke and check result
      control.handleLayerInteraction(eventArgs);
      expect(control.updateLayerStyle).toBeCalledWith(eventArgs);
    });
  });
});
