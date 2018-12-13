import { debounce } from './debounce';

describe('webgis4u.util.debounce', () => {
  it('check debounce', () => {
    const mockFunction = jest.fn();

    const debounceFunction = debounce(mockFunction);
    expect(debounceFunction).toBeDefined();
  });
});
