import { encodeQueryData } from './encodeQueryData';

describe('webgis4u/util/web/encodeQueryData', () => {
  it('with string', () => {
    expect(encodeQueryData({ test: 'test' })).toBe('test=test');
    expect(encodeQueryData({ test1: 'test1', test2: 'test2' })).toBe('test1=test1&test2=test2');
  });

  it('with number', () => {
    expect(encodeQueryData({ test: 1 })).toBe('test=1');
    expect(encodeQueryData({ test1: 1, test2: 2 })).toBe('test1=1&test2=2');
  });
});
