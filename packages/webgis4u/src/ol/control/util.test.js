import * as util from './util';


describe('webgis/ol/control/util', () => {
  it('should export modules', () => {
    expect(util).toBeDefined();
  });

  describe('defaults', () => {
    it('should define defaults', () => {
      expect(typeof(util.defaults)).toBe('function');
    });

    it('should create default controls', () => {
      const controls = util.defaults();

      expect(controls).toBeDefined();
    });
  });
});
