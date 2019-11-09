import * as proj from 'ol/proj';

import { disposeMap, createMap, createLayers } from '../../../test/utils/ol';

import OverviewMap, { CSS_CLASS as OverviewMapCssClass } from './OverviewMap';


describe('webgis4u/ol/control/OverviewMap', () => {
  let mockOverviewMapWrapper;
  let map;
  let control;
  let layers;

  const projTransformSpy = jest.spyOn(proj, 'transform');
  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new OverviewMap(options);
    map.addControl(control);
  };

  beforeEach(() => {
    // Prepare mock elements
    // Prepare layers
    layers = createLayers({ count: 1 });
    // Prepare map
    map = createMap({ layers });
    // Prepare the mock element
    mockOverviewMapWrapper = document.createElement('div');
    mockOverviewMapWrapper.className = OverviewMapCssClass;
    map.getTargetElement().appendChild(mockOverviewMapWrapper);
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
    mockOverviewMapWrapper = null;
  });

  describe('should contain control', () => {
    it('with a target', () => {
      // Prepare the mock element
      const mockElement = document.createElement('div');
      document.getElementsByTagName('body')[0].appendChild(mockElement);
      // Set up the control
      setupControl({
        target: mockElement,
      });
      // Check the result
      expect(map.getControls().getArray()).toContain(control);
    });

    it('with an element inside the map', () => {
      setupControl();
      expect(map.getControls().getArray()).toContain(control);
    });
  });

  it('should unset on setMap', () => {
    setupControl();

    control.setMap(null);

    expect(control.oldMap).toBe(null);
    expect(control.getOverviewMap()).toBe(null);
  });

  it('should update overview map', () => {
    setupControl();
    control.handleViewPropertyChanged();
  });

  it('should update map', () => {
    setupControl();
    const ovMap = control.getOverviewMap();
    expect(ovMap).not.toBe(null);

    projTransformSpy.mockImplementationOnce(() => undefined);
    const view = control.getMap().getView();
    view.setCenter = jest.fn();

    const coordinate = ovMap.getCoordinateFromPixel([0, 0]);
    control.centerMap({
      coordinate,
      map: ovMap,
    });

    expect(projTransformSpy).toBeCalled();
    expect(view.setCenter).toBeCalled();
  });

  it('should set static image', () => {
    setupControl();

    expect(control.imageLayer).toBeDefined();
    const imageSource = control.imageLayer.get('source');
    expect(imageSource).toBeDefined();
    expect(imageSource.image_.imageLoadFunction_).toBeDefined();

    // eslint-disable-next-line require-jsdoc
    class MockImage {
      get src() { return ''; }

      // eslint-disable-next-line no-empty-function
      set src(value) { }
    }

    const mockImage = new MockImage();
    const setImageSrc = jest.spyOn(mockImage, 'src', 'set');
    const mockImageWrapper = {
      getImage: jest.fn(() => mockImage),
    };

    imageSource.image_.imageLoadFunction_(mockImageWrapper);
    expect(setImageSrc).toBeCalled();
  });
});
