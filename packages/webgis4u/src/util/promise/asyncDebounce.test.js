import { asyncDebounce } from './asyncDebounce';

jest.useFakeTimers();

describe('webgis4u/util/promise/asyncDebounce', () => {
  let mockPromise;
  let mockPromiseResolve;
  let mockFunction;
  let wait;
  let debouncedFunction;

  beforeEach(() => {
    mockFunction = jest.fn(() => {
      mockPromise = new Promise((resolve, reject) => {
        mockPromiseResolve = resolve;
      });

      return mockPromise;
    });
    wait = 100;
    debouncedFunction = asyncDebounce(mockFunction, wait);
  });

  it('with non async', async () => {
    const mockParams = [1, 'test'];
    const R = debouncedFunction(...mockParams);
    debouncedFunction(...mockParams);
    expect(mockFunction).not.toBeCalled();

    // Fast-forward until all timers have been executed
    jest.runAllTimers();

    // Check if the mock function was called
    expect(mockFunction).toBeCalledTimes(1);
    expect(mockFunction).toBeCalledWith(...mockParams);
    // Await the fulfilled state
    mockPromiseResolve(true);
    const result = await R;
    expect(result).toBe(true);
  });
});
