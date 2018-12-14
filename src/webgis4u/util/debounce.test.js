import { debounce } from './debounce';

jest.useFakeTimers();

/**
 * @typedef {Object} DebounceSetupResult
 * @property {Function} mockFunction The mock function
 * @property {number} wait The time with which the debounce function was called
 * @property {Function} debouncedFunction The debounced function
 */

describe('webgis4u.util.debounce', () => {
  /**
   * Setup the debounced function
   *
   * @param {boolean} immediate
   * If true, `func` is called on the leading edge instead of the trailing.
   *
   * @returns {DebounceSetupResult}
   */
  const setup = (immediate) => {
    const mockFunction = jest.fn();
    const wait = 100;
    const debouncedFunction = debounce(mockFunction, wait, immediate);

    return {
      mockFunction,
      wait,
      debouncedFunction,
    };
  };

  it('should return a function', () => {
    const mockFunction = jest.fn();

    const debounceFunction = debounce(mockFunction);
    expect(typeof debounceFunction).toBe('function');
    expect(mockFunction).not.toBeCalled();
  });

  it('should call function (trailing)', () => {
    const {
      mockFunction,
      debouncedFunction,
    } = setup(false);
    const mockParams = [1, 'test'];

    // Call the debounced function
    debouncedFunction(...mockParams);
    expect(mockFunction).not.toBeCalled();

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    // Check if the mock function was called
    expect(mockFunction).toBeCalled();
    expect(mockFunction).toBeCalledWith(...mockParams);
  });

  it('should call function (leading)', () => {
    const {
      mockFunction,
      debouncedFunction,
    } = setup(true);
    const mockParams = [1, 'test'];

    // Call the debounced function
    debouncedFunction(...mockParams);

    // Check if the function was called
    expect(mockFunction).toBeCalled();
    expect(mockFunction).toBeCalledWith(...mockParams);

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    // Check if the mock function was not called again
    expect(mockFunction).toBeCalledTimes(1);
  });

  it('should debounce function calls (trailing)', () => {
    const {
      mockFunction,
      debouncedFunction,
      wait,
    } = setup(false);
    const mockParams = [1, 'test'];

    // Call the debounced function
    debouncedFunction(...mockParams);
    expect(mockFunction).not.toBeCalled();

    // Advance the timers, but not that much that the
    // debounced function is called
    jest.advanceTimersByTime(wait - 1);
    expect(mockFunction).not.toBeCalled();

    // Call the debounced function again
    debouncedFunction(...mockParams);

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    // Check if the original function was called correctly
    expect(mockFunction).toBeCalled();
    expect(mockFunction).toBeCalledTimes(1);
    expect(mockFunction).toBeCalledWith(...mockParams);
  });
});
