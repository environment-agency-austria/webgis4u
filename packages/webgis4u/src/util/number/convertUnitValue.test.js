import { convertUnitValue } from './convertUnitValue';

describe('webgis4u/util/number/convertUnitValue', () => {
  const unitMilliMeter = { abbreviation: 'mm', factor: 0.001, limit: 0.001 };
  const unitCentiMeter = { abbreviation: 'cm', factor: 0.01, limit: 0.01 };
  const unitMeter = { abbreviation: 'm', fallback: true };
  const unitHectoMeter = { abbreviation: 'hm', factor: 100 };
  const unitKiloMeter = { abbreviation: 'km', factor: 1000, limit: 1000 };
  const mockUnits = [
    unitMilliMeter,
    unitCentiMeter,
    unitMeter,
    unitHectoMeter,
    unitKiloMeter,
  ];

  const testCases = [
    [0, 0, unitMeter],
    [0.001, 1, unitMilliMeter],
    [0.0095, 9.5, unitMilliMeter],
    [0.0099, 9.9, unitMilliMeter],
    [0.01, 1, unitCentiMeter],
    [0.1, 10, unitCentiMeter],
    [0.5, 50, unitCentiMeter],
    [0.99, 99, unitCentiMeter],
    [0.999, 99.89999999999999, unitCentiMeter],
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
    expect(r.unit).toMatchObject(toUnit);
  });
});
