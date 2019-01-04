import { formatUnitValue } from './formatUnitValue';

describe('webgis4u/util/string/formatUnitValue', () => {
  const mockUnits = [
    // TODO: Make code work with fraction units
    // { abbreviation: 'mm', factor: 0.001, limit: 0.001 },
    { abbreviation: 'm', fallback: true },
    { abbreviation: 'hm', factor: 100 },
    { abbreviation: 'km', factor: 1000, limit: 1000 },
  ];

  const testCases = [
    // Without decimals
    ['0 m', 0, 0],
    ['1 m', 1, 0],
    ['10 m', 10, 0],
    ['1 hm', 100, 0],
    ['1 km', 1000, 0],
    ['10 km', 10000, 0],
    ['100 km', 100000, 0],
    // With decimals
    ['0,00 m', 0, 2],
    ['1,00 m', 1, 2],
    ['10,00 m', 10, 2],
    ['1,00 hm', 100, 2],
    ['1,00 km', 1000, 2],
    ['10,00 km', 10000, 2],
    ['100,00 km', 100000, 2],
  ];

  test.each(testCases)('should return %s with (value=%s)', (expected, value, decimals) => {
    const r = formatUnitValue({
      value,
      decimals,
      units: mockUnits,
    });

    expect(r).toBe(expected);
  });
});
