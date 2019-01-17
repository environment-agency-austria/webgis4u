import OverviewMap from '../control/OverviewMap';
import ScaleLine from '../control/ScaleLine';

import { createImageFromMap } from './createImageFromMap';

import { print } from './print';

jest.mock('../control/OverviewMap');
jest.mock('../control/ScaleLine');
jest.mock('./createImageFromMap');

describe('webgis4u/ol/util/zoomToLayerExtent', () => {
  const mockImageMap = 'mock-map';
  const mockOverviewMap = 'mock-overviewmap';
  const mockScale = 'mock-scale';

  let map;
  let mockForEachControl;
  let controls;
  let overviewmap;
  let scaleLine;
  beforeEach(() => {
    overviewmap = new OverviewMap();
    scaleLine = new ScaleLine();
    scaleLine.export = jest.fn(() => mockScale);
    overviewmap.getOverviewMap = jest.fn(() => overviewmap);
    controls = [
      overviewmap,
      scaleLine,
      'some-other-control',
    ];

    createImageFromMap.mockImplementation((a, cb) => {
      if (a === map) {
        cb(mockImageMap);
      } else if (a === overviewmap) {
        cb(mockOverviewMap);
      }
    });

    mockForEachControl = jest.fn((cb) => {
      controls.forEach(c => cb(c));
    });

    map = {
      getControls: jest.fn(() => ({
        forEach: mockForEachControl,
      })),
    };
  });

  afterEach(() => {
    createImageFromMap.mockClear();
  });

  it('should print whole map', () => {
    const callback = jest.fn();

    print(map, callback);

    expect(callback).toBeCalled();

    const params = callback.mock.calls[0][0];
    expect(params.map).toBe(mockImageMap);
    expect(params.overviewMap).toBe(mockOverviewMap);
    expect(params.scaleLine).toBe(mockScale);
  });

  it('should print map without overview', () => {
    const callback = jest.fn();
    controls = [
      scaleLine,
    ];

    print(map, callback);

    expect(callback).toBeCalled();

    const params = callback.mock.calls[0][0];
    expect(params.map).toBe(mockImageMap);
    expect(params.overviewMap).toBeUndefined();
    expect(params.scaleLine).toBe(mockScale);
  });

  it('should print map without overview', () => {
    const callback = jest.fn();
    controls = [
      overviewmap,
    ];

    print(map, callback);

    expect(callback).toBeCalled();

    const params = callback.mock.calls[0][0];
    expect(params.map).toBe(mockImageMap);
    expect(params.overviewMap).toBe(mockOverviewMap);
    expect(params.scaleLine).toBeUndefined();
  });
});
