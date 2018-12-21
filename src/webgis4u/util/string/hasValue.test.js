import { hasValue } from './hasValue';

describe('webgis4u/util/string/hasValue', () => {
  describe('should return false', () => {
    const testCases = [
      ['undefined', undefined],
      ['null', null],
      ['number (0)', 0],
      ['number (1)', 1],
      ['number (-1)', -1],
      ['object ({})', {}],
      ['object ({something: "value"})', { something: 'value' }],
      ['array ([])', []],
      ['object (["value"])', ['value']],
    ];

    test.each(testCases)('for (%s)', (name, value) => {
      expect(hasValue(value)).toBe(false);
    });
  });

  it('should return true', () => {
    expect(hasValue('test')).toBe(true);
  });
});
