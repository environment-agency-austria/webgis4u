import {
  SELECT_STROKE,
  SELECT_FILL,
  MODIFY_STROKE,
  MODIFY_FILL,
  HOVER_STROKE,
  HOVER_FILL,
  HALO,
} from './color';

describe('webgis4u/ol/style/color', () => {
  const testCases = [
    ['SELECT_STROKE', SELECT_STROKE],
    ['SELECT_FILL', SELECT_FILL],
    ['MODIFY_STROKE', MODIFY_STROKE],
    ['MODIFY_FILL', MODIFY_FILL],
    ['HOVER_STROKE', HOVER_STROKE],
    ['HOVER_FILL', HOVER_FILL],
    ['HALO', HALO],
  ];

  test.each(testCases)('should export %s', (name, color) => {
    expect(color).not.toBeUndefined();
    expect(color.length).toBe(4);
  });
});
