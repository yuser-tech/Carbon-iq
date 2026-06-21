/**
 * Security Utilities for CarbonIQ AI
 * Provides sanitization and security helpers
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The potentially dirty HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitizes plain text to prevent XSS through injection
 * @param input - The potentially unsafe text input
 * @returns Sanitized text safe for display
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '') // Remove control characters
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Sanitizes user input for safe storage
 * @param input - The raw user input
 * @returns Sanitized input safe for storage
 */
export function sanitizeForStorage(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validates that a URL is safe to use
 * @param url - The URL to validate
 * @returns True if the URL is safe
 */
export function isSafeUrl(url: string): boolean {
  if (typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Escapes regex special characters in a string
 * @param input - The string to escape
 * @returns Escaped string safe for use in regex
 */
export function escapeRegex(input: string): string {
  if (typeof input !== 'string') return '';
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Strips all HTML tags from a string
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string): string {
  if (typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Truncates text to a maximum length while preserving word boundaries
 * @param text - The text to truncate
 * @param maxLength - Maximum length of the result
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Masks sensitive data for logging purposes
 * @param data - The data to mask
 * @returns Masked data safe for logging
 */
export function maskSensitiveData(data: string): string {
  if (typeof data !== 'string' || data.length < 4) return '***';
  const visibleChars = Math.min(4, Math.floor(data.length / 4));
  return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars * 2) + data.slice(-visibleChars);
}
