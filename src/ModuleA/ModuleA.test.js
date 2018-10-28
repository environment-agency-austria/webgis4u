import { demoA, demoB, demoC, DemoClass } from './ModuleA';

describe('ModuleA', () => {
  describe('demoA', () => {
    it('should return the string as-is', () => {
      const string = 'mock';
      expect(demoA(string)).toBe(string);
    });
  });

  describe('demoB', () => {
    it('should return 42', () => {
      expect(demoB()).toBe(42);
    });
  });

  describe('demoC', () => {
    it('should return the passed object with additional foo: "bar" prop', () => {
      const mockObject = {
        mock: 'object',
      };

      expect(demoC(mockObject)).toEqual({
        mock: 'object',
        foo: 'bar',
      });
    });
  });

  describe('DemoClass', () => {
    const mockInstance = new DemoClass();

    describe('foobar', () => {
      it('should return "bar"', () => {
        expect(mockInstance.foobar()).toBe('bar');
      });
    });
  });
});
