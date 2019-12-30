import { getPseudoCenter } from './getPseudoCenter';

const { getCenter } = jest.requireActual('ol/extent');

describe('webgis4u/ol/geom/getPseudoCenter', () => {
  const maxX = 10;
  const maxY = 10;
  const minX = -10;
  const minY = -10;
  const extent1 = [0, 0, maxX, maxY];
  const extent2 = [minX, minY, 0, 0];


  it('should return null', () => {
    const result = getPseudoCenter();
    const result2 = getPseudoCenter({});

    expect(result).toBeNull();
    expect(result2).toBeNull();
  });

  it('should return point geometry', () => {
    const mockPoint = {
      getType: jest.fn(() => 'Point'),
    };

    const result = getPseudoCenter(mockPoint);
    expect(result).toBe(mockPoint);
  });

  it('should return center for circle', () => {
    const mockPoint = {
      getType: jest.fn(() => 'Circle'),
      getExtent: jest.fn(() => extent1),
    };

    const result = getPseudoCenter(mockPoint);
    expect(result.flatCoordinates).toEqual(getCenter(extent1));
  });

  it('should return center for geometry if intersecting', () => {
    const mockPoint = {
      getType: jest.fn(() => 'Any'),
      getExtent: jest.fn(() => extent1),
      intersectsCoordinate: jest.fn(() => true),
    };

    const result = getPseudoCenter(mockPoint);
    expect(result.flatCoordinates).toEqual(getCenter(extent1));
  });

  it('should return closest point if not intersecting', () => {
    const mockClosestPoint = [-100, -100];
    const mockPoint = {
      getType: jest.fn(() => 'Any'),
      getExtent: jest.fn(() => extent1),
      intersectsCoordinate: jest.fn(() => false),
      getClosestPoint: jest.fn(() => mockClosestPoint),
    };

    const result = getPseudoCenter(mockPoint);
    expect(result.flatCoordinates).toEqual(mockClosestPoint);
  });
});
