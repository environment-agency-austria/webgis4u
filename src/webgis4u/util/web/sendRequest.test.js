import { sendRequest } from './sendRequest';

describe('webgis4u/util/web/sendRequest', () => {
  const oldXMLHttpRequest = window.XMLHttpRequest;
  let mockSend;
  let xhrMock;

  const defaultOptions = {
    url: 'some url',
    type: 'GET',
    timeout: 3000,
  };

  /**
   *
   * @param {objectr} responseJSON
   */
  const createMockXHR = (response) => {
    mockSend = jest.fn();

    const mockXHR = {
      open: jest.fn(),
      send: mockSend,
      readyState: 4,
      response,
    };
    return mockXHR;
  };

  beforeEach(() => {
    xhrMock = createMockXHR({ test: 'test' });
    window.XMLHttpRequest = jest.fn(() => xhrMock);
  });

  afterEach(() => {
    window.XMLHttpRequest = oldXMLHttpRequest;
  });

  it('should return data', () => {
    const success = jest.fn();
    const error = jest.fn();
    const options = {
      ...defaultOptions,
      success,
      error,
      data: { test: 'test' },
    };
    sendRequest(options);

    expect(mockSend).toBeCalled();
    xhrMock.status = 200;
    xhrMock.onload();
    expect(success).toBeCalled();
  });

  it('should return data', () => {
    const success = jest.fn();
    const error = jest.fn();
    const options = {
      ...defaultOptions,
      success,
      error,
      data: { test: 'test' },
    };
    sendRequest(options);

    expect(mockSend).toBeCalled();
    xhrMock.status = 404;
    xhrMock.onload();
    expect(error).toBeCalled();
  });

  it('should throw an error', () => {
    const success = jest.fn();
    const error = jest.fn();
    const options = {
      ...defaultOptions,
      success,
      error,
    };
    sendRequest(options);

    expect(mockSend).toBeCalled();
    xhrMock.onerror(xhrMock, { type: 'error' });
    expect(error).toBeCalled();
  });

  // it ('should throw an error', () => {

  // });

  // it('with string', () => {
  //   expect(encodeQueryData({ test: 'test' })).toBe('test=test');
  //   expect(encodeQueryData({ test1: 'test1', test2: 'test2' })).toBe('test1=test1&test2=test2');
  // });

  // it('with number', () => {
  //   expect(encodeQueryData({ test: 1 })).toBe('test=1');
  //   expect(encodeQueryData({ test1: 1, test2: 2 })).toBe('test1=1&test2=2');
  // });
});
