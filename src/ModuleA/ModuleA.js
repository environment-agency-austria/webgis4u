/**
 * Demo function A
 * @param {string} foo Demo parameter
 */
export function demoA(foo) {
  return foo;
}

/**
 * Demo function B
 */
export function demoB() {
  return 42;
}

/**
 * Demo function C
 * @param {object} obj Demo object
 */
export function demoC(obj) {
  return {
    ...obj,
    foo: 'bar',
  };
}

/**
 * Demo class
 */
export class DemoClass {
  /**
   * Demo method
   */
  foobar() {
    return 'bar';
  }
}
