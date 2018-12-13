import { formatText } from './formatText';

describe('webgis4u.util.formatText', () => {
  it('check formatText', () => {
    expect(formatText('Hello world')).toBe('Hello world');
    expect(formatText('Hello {0} world')).toBe('Hello {0} world');
    expect(formatText('Hello {0} world', 'my')).toBe('Hello my world');
    expect(formatText('Hello {0} world {1}', 'my')).toBe('Hello my world {1}');
    expect(formatText('Hello {0} world {1}', 'my', 'today')).toBe('Hello my world today');
  });
});
