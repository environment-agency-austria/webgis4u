import { changeMapTarget } from './changeMapTarget';

describe('webgis4u/ol/util/changeMapTarget', () => {
  let map;
  const control = { setMap: jest.fn() };
  let newTarget;
  let currentTarget;

  beforeEach(() => {
    const body = document.getElementsByTagName('body')[0];

    // Mock current map target
    currentTarget = document.createElement('div');
    currentTarget.id = 'mock-id-currentTarget';
    body.appendChild(currentTarget);

    // Mock new map target
    newTarget = document.createElement('div');
    newTarget.id = 'mock-id-newTarget';
    body.appendChild(newTarget);

    const mockOldViewport = document.createElement('div');
    mockOldViewport.className = 'ol-viewport';
    newTarget.appendChild(mockOldViewport);

    // Prepare map
    map = {
      getControls: jest.fn(() => [control, control]),
      getTargetElement: jest.fn(() => currentTarget),
      getSize: jest.fn(),
      getView: jest.fn(() => ({
        fit: jest.fn(),
        calculateExtent: jest.fn(),
      })),
      setTarget: jest.fn(),
    };
  });

  describe('changeMapTarget', () => {
    it('without an element', () => {
      changeMapTarget('mock-id-not-existent', map);
      expect(map.getTargetElement).not.toBeCalled();
    });

    it('with an element', () => {
      changeMapTarget('mock-id-newTarget', map);

      expect(map.getTargetElement).toBeCalled();
      expect(map.setTarget).toBeCalledWith(newTarget);
      expect(control.setMap).toBeCalledTimes(2);
    });
  });
});
