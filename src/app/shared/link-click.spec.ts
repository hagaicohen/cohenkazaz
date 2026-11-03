import { isPlainLeftClick } from './link-click';

describe('isPlainLeftClick', () => {
  it('handles a plain left click inside the site', () => {
    expect(isPlainLeftClick(new MouseEvent('click', { button: 0 }))).toBeTrue();
  });

  it('handles keyboard activation and missing events inside the site', () => {
    expect(isPlainLeftClick(new KeyboardEvent('keydown'))).toBeTrue();
    expect(isPlainLeftClick(undefined)).toBeTrue();
  });

  for (const key of ['ctrlKey', 'metaKey', 'shiftKey', 'altKey']) {
    it(`leaves ${key}+click to the browser (new tab / window)`, () => {
      expect(isPlainLeftClick(new MouseEvent('click', { button: 0, [key]: true }))).toBeFalse();
    });
  }

  it('leaves non-primary buttons to the browser', () => {
    expect(isPlainLeftClick(new MouseEvent('click', { button: 1 }))).toBeFalse();
  });
});
