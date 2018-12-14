import * as style from './style';

describe('webgis4u/ol/style/style ', () => {
  const testCases = [
    ['SELECT', style.SELECT],
    ['HOVER', style.HOVER],
    ['MODIFY', style.MODIFY],
  ];

  test.each(testCases)('should export %s', (name, exportedStyle) => {
    expect(Array.isArray(exportedStyle)).toBe(true);
    expect(exportedStyle.length).toBe(3);
  });

  it('should return style (getPointStyle)', () => {
    const pointStyle = style.getPointStyle(3, 10, [255, 0, 0, 0.8], [255, 255, 255, 0.2]);
    expect(pointStyle).toBeDefined();
  });

  it('should return style (getStyle)', () => {
    const styled = style.getStyle(3, 10, [255, 0, 0, 0.8], [255, 255, 255, 0.2]);
    expect(styled).toBeDefined();
  });

  it('should return style (getIconStyle)', () => {
    const styled = style.getIconStyle('an image source', 0.5, 0.5, 0.5);
    expect(styled).toBeDefined();
  });
});
