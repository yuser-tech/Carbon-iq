const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/g;
const COLLAPSED_WHITESPACE = /\s+/g;
const SCRIPT_OR_STYLE_BLOCKS = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;
const EVENT_HANDLER_ATTRIBUTES = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JAVASCRIPT_URLS = /\s+(href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|\s*javascript:[^\s>]*)/gi;
const UNSAFE_TAGS = /<\/?(?:iframe|object|embed|form|input|button|textarea|select|option|meta|link|base|svg|math)\b[^>]*>/gi;
const MALFORMED_UNSAFE_TAGS = /<(?:img|iframe|object|embed|form|input|button|textarea|select|option|meta|link|base|svg|math)\b[^>]*(?:>|$)/gi;
const DISALLOWED_TAGS = /<\/?(?!\/?(?:p|br|strong|em|b|i|ul|ol|li|a)\b)[^>]*>/gi;
const DISALLOWED_ATTRIBUTES = /\s+(?!href\b|target\b|rel\b)[a-zA-Z:-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/g;
const OPEN_ANGLE_BRACKETS_IN_TEXT = /<(?!\/?(?:p|br|strong|em|b|i|ul|ol|li|a)\b)/gi;

export function sanitizeText(value: string) {
  return value
    .replace(SCRIPT_OR_STYLE_BLOCKS, ' ')
    .replace(/[<>]/g, '')
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(COLLAPSED_WHITESPACE, ' ')
    .trim();
}

export function sanitizeLimitedHtml(value: string) {
  return value
    .replace(SCRIPT_OR_STYLE_BLOCKS, '')
    .replace(EVENT_HANDLER_ATTRIBUTES, '')
    .replace(JAVASCRIPT_URLS, '')
    .replace(UNSAFE_TAGS, '')
    .replace(MALFORMED_UNSAFE_TAGS, '')
    .replace(DISALLOWED_ATTRIBUTES, '')
    .replace(DISALLOWED_TAGS, '')
    .replace(OPEN_ANGLE_BRACKETS_IN_TEXT, '&lt;')
    .replace(CONTROL_CHARACTERS, ' ')
    .replace(COLLAPSED_WHITESPACE, ' ')
    .trim();
}
