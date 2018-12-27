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
