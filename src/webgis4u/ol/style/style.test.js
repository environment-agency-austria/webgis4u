import * as style from './style';

describe('webgis4u/ol/style/style ', () => {
  describe('export styles', () => {
    const testCases = [
      ['SELECT', style.SELECT],
      ['HOVER', style.HOVER],
      ['MODIFY', style.MODIFY],
    ];

    test.each(testCases)('should export %s', (name, exportedStyle) => {
      expect(Array.isArray(exportedStyle)).toBe(true);
      expect(exportedStyle.length).toBe(3);
    });
  });

  describe('create style functions', () => {
    const mockColor1 = [255, 0, 0, 0.8];
    const mockColor2 = [255, 255, 255, 0.2];
    it('should return style (getPointStyle)', () => {
      const pointStyle = style.getPointStyle({
        width: 3,
        radius: 10,
        strokeColor: mockColor1,
        fillColor: mockColor2,
      });
      expect(pointStyle).toBeDefined();
    });

    it('should return style (getStyle)', () => {
      const styled = style.getStyle({
        width: 3,
        radius: 10,
        strokeColor: mockColor1,
        fillColor: mockColor2,
      });
      expect(styled).toBeDefined();
    });

    it('should return style (getIconStyle)', () => {
      const iconStyle = style.getIconStyle({
        src: 'an image source',
        anchorX: 0.5,
        anchorY: 0.5,
        opacity: 0.5,
      });
      expect(iconStyle).toBeDefined();
    });
  });
});
