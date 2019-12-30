import { isDisplayable } from './isDisplayable';

describe('webgis4u/ol/layer/isDisplayable', () => {
  const minResolution = 10;
  const maxResolution = 20;
  const mockLayer = {
    getMinResolution: jest.fn(() => minResolution),
    getMaxResolution: jest.fn(() => maxResolution),
  };

  it('should return true', () => {
    const result = isDisplayable(mockLayer, 15);

    expect(result).toBe(true);
  });

  it('should return false for lower than min', () => {
    const result = isDisplayable(mockLayer, minResolution - 1);

    expect(result).toBe(false);
  });

  it('should return false for higher than max', () => {
    const result = isDisplayable(mockLayer, maxResolution + 1);

    expect(result).toBe(false);
  });
});
