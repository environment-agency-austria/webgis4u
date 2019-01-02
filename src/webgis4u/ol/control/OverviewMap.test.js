import { disposeMap, createMap, createLayers } from '../../../../test/utils/ol';

import OverviewMap from './OverviewMap';

describe('webgis4u/ol/control/OverviewMap', () => {
  const mockOverviewMapWrapperId = 'mock-overview-map-wrapper';
  let mockOverviewMapWrapper;
  let mockElement2;
  let map;
  let control;
  let layers;

  /**
   * Set up the control
   */
  const setupControl = (options) => {
    control = new OverviewMap(options);
    map.addControl(control);
  };

  beforeEach(() => {
    // Prepare mock elements
    mockOverviewMapWrapper = document.createElement('div');
    mockOverviewMapWrapper.id = mockOverviewMapWrapper;
    // ...and append them
    document.getElementsByTagName('body')[0].appendChild(mockOverviewMapWrapper);
    // Prepare layers
    layers = createLayers({ count: 1 });
    // Prepare map
    map = createMap({ layers });
  });

  afterEach(() => {
    disposeMap(map);
    map = null;
    control = null;
    // Remove the mock element from the mock DOM
    document.getElementsByTagName('html')[0].innerHTML = '';
    mockOverviewMapWrapper = null;
    mockElement2 = null;
  });

  it('should contain control', () => {
    setupControl({
      target: mockOverviewMapWrapper,
    });
    expect(map.getControls().getArray()).toContain(control);
  });
});
