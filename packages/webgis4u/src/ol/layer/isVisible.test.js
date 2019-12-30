import { isVisible, isVisibleInView, isVisibleForMap } from './isVisible';

describe('webgis4u/ol/layer/isVisible', () => {
  const minResolution = 10;
  const maxResolution = 20;
  const mockLayer = {
    getVisible: jest.fn(() => true),
    getMinResolution: jest.fn(() => minResolution),
    getMaxResolution: jest.fn(() => maxResolution),
  };

  it('should return true', () => {
    const result = isVisible(mockLayer, 15);

    expect(result).toBe(true);
  });

  it('should return false for getVisible=false', () => {
    mockLayer.getVisible.mockImplementationOnce(() => false);
    const result = isVisible(mockLayer, 15);

    expect(result).toBe(false);
  });

  it('should return false for lower than min', () => {
    const result = isVisible(mockLayer, minResolution - 1);

    expect(result).toBe(false);
  });

  it('should return false for higher than max', () => {
    const result = isVisible(mockLayer, maxResolution + 1);

    expect(result).toBe(false);
  });
});

describe('webgis4u/ol/layer/isVisibleInView', () => {
  const minResolution = 10;
  const maxResolution = 20;
  const mockLayer = {
    getVisible: jest.fn(() => true),
    getMinResolution: jest.fn(() => minResolution),
    getMaxResolution: jest.fn(() => maxResolution),
  };
  const mockView = {
    getResolution: jest.fn(() => 15),
  };

  it('should return true', () => {
    const result = isVisibleInView(mockLayer, mockView);

    expect(result).toBe(true);
  });
});

describe('webgis4u/ol/layer/isVisibleForMap', () => {
  const minResolution = 10;
  const maxResolution = 20;
  const mockLayer = {
    getVisible: jest.fn(() => true),
    getMinResolution: jest.fn(() => minResolution),
    getMaxResolution: jest.fn(() => maxResolution),
  };
  const mockView = {
    getResolution: jest.fn(() => 15),
  };
  const mockMap = {
    getView: jest.fn(() => mockView),
  };

  it('should return true', () => {
    const result = isVisibleForMap(mockLayer, mockMap);

    expect(result).toBe(true);
  });
});
