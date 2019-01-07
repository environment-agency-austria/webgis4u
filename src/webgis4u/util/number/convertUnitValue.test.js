import { convertUnitValue } from './convertUnitValue';

describe('webgis4u/util/number/convertUnitValue', () => {
  const unitMeter = { abbreviation: 'm', fallback: true };
  const unitHectoMeter = { abbreviation: 'hm', factor: 100 };
  const unitKiloMeter = { abbreviation: 'km', factor: 1000, limit: 1000 };
  const mockUnits = [
    // TODO: Make code work with fraction units
    // { abbreviation: 'mm', factor: 0.001, limit: 0.001 },
    unitMeter,
    unitHectoMeter,
    unitKiloMeter,
  ];

  const testCases = [
    [0, 0, unitMeter],
    [1, 1, unitMeter],
    [10, 10, unitMeter],
    [100, 1, unitHectoMeter],
    [1000, 1, unitKiloMeter],
    [10000, 10, unitKiloMeter],
    [100000, 100, unitKiloMeter],
  ];

  test.each(testCases)('should convert %s to %s in unit %s)', (value, toValue, toUnit) => {
    const r = convertUnitValue({
      value,
      units: mockUnits,
    });

    expect(r.value).toBe(value);
    expect(r.convertedValue).toBe(toValue);
    expect(r.unit).toBe(toUnit);
  });
});
