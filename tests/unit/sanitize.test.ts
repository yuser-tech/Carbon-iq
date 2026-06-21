/**
 * Tests for Security Sanitization Utilities
 */

import {
  sanitizeHtml,
  sanitizeText,
  sanitizeForStorage,
  isSafeUrl,
  escapeRegex,
  stripHtml,
  truncateText,
  maskSensitiveData,
} from '@/lib/sanitize';

describe('sanitizeHtml', () => {
  it('removes script tags', () => {
    const input = '<script>alert("xss")</script>Hello';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('Hello');
  });

  it('removes event handlers', () => {
    const input = '<img src="x" onerror="alert(1)">';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onerror');
  });

  it('preserves allowed tags', () => {
    const input = '<b>Bold</b> and <i>italic</i>';
    const result = sanitizeHtml(input);
    expect(result).toContain('<b>Bold</b>');
    expect(result).toContain('<i>italic</i>');
  });

  it('handles empty string', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('handles non-string input', () => {
    expect(sanitizeHtml(null as unknown as string)).toBe('');
    expect(sanitizeHtml(undefined as unknown as string)).toBe('');
  });
});

describe('sanitizeText', () => {
  it('removes control characters', () => {
    const input = 'Hello\x00World\x1F';
    expect(sanitizeText(input)).toBe('HelloWorld');
  });

  it('removes angle brackets', () => {
    const input = 'Hello <script>World</script>';
    expect(sanitizeText(input)).toBe('Hello scriptWorld/script');
  });

  it('removes javascript protocol', () => {
    const input = 'javascript:alert(1)';
    expect(sanitizeText(input)).toBe('alert(1)');
  });

  it('normalizes whitespace', () => {
    const input = 'Hello    World\n\nTest';
    expect(sanitizeText(input)).toBe('Hello WorldTest');
  });

  it('trims input', () => {
    expect(sanitizeText('  Hello  ')).toBe('Hello');
  });
});

describe('sanitizeForStorage', () => {
  it('escapes HTML entities', () => {
    const input = '<script>alert("test")</script>';
    const result = sanitizeForStorage(input);
    expect(result).toBe('scriptalert(&quot;test&quot;)&#x2F;script');
  });

  it('handles empty input', () => {
    expect(sanitizeForStorage('')).toBe('');
  });
});

describe('isSafeUrl', () => {
  it('accepts http URLs', () => {
    expect(isSafeUrl('http://example.com')).toBe(true);
  });

  it('accepts https URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
  });

  it('rejects javascript URLs', () => {
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data URLs', () => {
    expect(isSafeUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('rejects invalid URLs', () => {
    expect(isSafeUrl('not-a-url')).toBe(false);
  });

  it('handles non-string input', () => {
    expect(isSafeUrl(null as unknown as string)).toBe(false);
  });
});

describe('escapeRegex', () => {
  it('escapes special regex characters', () => {
    const input = 'test.*+?^${}()|[]\\';
    const result = escapeRegex(input);
    expect(result).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('handles plain text', () => {
    expect(escapeRegex('hello')).toBe('hello');
  });
});

describe('stripHtml', () => {
  it('removes all HTML tags', () => {
    const input = '<div class="test"><p>Hello <b>World</b></p></div>';
    expect(stripHtml(input)).toBe('Hello World');
  });

  it('handles plain text', () => {
    expect(stripHtml('Hello World')).toBe('Hello World');
  });
});

describe('truncateText', () => {
  it('truncates long text', () => {
    const input = 'This is a very long text that should be truncated';
    const result = truncateText(input, 20);
    expect(result).toBe('This is a very long...');
  });

  it('preserves word boundaries', () => {
    const input = 'This is a very long text that should be truncated';
    const result = truncateText(input, 25);
    expect(result).toBe('This is a very long text...');
  });

  it('returns original text if shorter', () => {
    const input = 'Short text';
    expect(truncateText(input, 50)).toBe('Short text');
  });

  it('handles non-string input', () => {
    expect(truncateText(null as unknown as string, 10)).toBe('');
  });
});

describe('maskSensitiveData', () => {
  it('masks long strings', () => {
    const input = 'abcdefghij';
    const result = maskSensitiveData(input);
    expect(result).toBe('ab******ij');
  });

  it('masks short strings', () => {
    expect(maskSensitiveData('abc')).toBe('***');
  });

  it('returns *** for very short input', () => {
    expect(maskSensitiveData('ab')).toBe('***');
  });
});
