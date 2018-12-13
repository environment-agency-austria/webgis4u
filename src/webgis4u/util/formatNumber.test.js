import { formatNumber } from './formatNumber';

describe('webgis4u.util.formatNumber', () => {
  it('without fraction', () => {
    expect(formatNumber(123.456, 0)).toBe('123');
    expect(formatNumber(1234.456, 0)).toBe('1.234');
    expect(formatNumber(123456.456, 0)).toBe('123.456');
    expect(formatNumber(1234567.456, 0)).toBe('1.234.567');
  });

  it('with fraction', () => {
    expect(formatNumber(123.456, 2)).toBe('123,46');
    expect(formatNumber(1234.456, 2)).toBe('1.234,46');
    expect(formatNumber(123456.456, 2)).toBe('123.456,46');
    expect(formatNumber(1234567.456, 2)).toBe('1.234.567,46');
  });

  it('NaN', () => {
    expect(formatNumber('hello world')).toBe('NaN');
    expect(formatNumber(undefined, 2)).toBe('NaN');
    expect(formatNumber()).toBe('NaN');
  });
});
