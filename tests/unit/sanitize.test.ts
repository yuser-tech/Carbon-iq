import { sanitizeLimitedHtml, sanitizeText } from '@/lib/sanitize';

describe('sanitize utilities', () => {
  it('removes script tags and their contents from text and limited HTML', () => {
    expect(sanitizeText('Save energy <script>alert("xss")</script> today')).toBe('Save energy today');
    expect(sanitizeLimitedHtml('<p>Save energy</p><script>alert("xss")</script>')).toBe('<p>Save energy</p>');
  });

  it('removes event-handler attributes from limited HTML', () => {
    expect(sanitizeLimitedHtml('<p onclick="steal()">Use cold water</p>')).toBe('<p>Use cold water</p>');
  });

  it('handles malformed HTML without preserving unsafe brackets', () => {
    expect(sanitizeLimitedHtml('Try <strong>batch cooking</strong> <img src=x onerror=alert(1)')).toBe(
      'Try <strong>batch cooking</strong>',
    );
  });

  it('normalizes control characters in text and limited HTML', () => {
    expect(sanitizeText('bike\u0000 more\u001F often')).toBe('bike more often');
    expect(sanitizeLimitedHtml('<p>bike\u0000 more\u001F often</p>')).toBe('<p>bike more often</p>');
  });

  it('preserves normal sustainability-coach text', () => {
    const message = 'Try line-drying two laundry loads per week to lower your household energy footprint.';

    expect(sanitizeText(message)).toBe(message);
    expect(sanitizeLimitedHtml(`<p>${message}</p>`)).toBe(`<p>${message}</p>`);
  });
});
