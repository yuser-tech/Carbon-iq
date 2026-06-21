import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  // Next.js and existing React style props require inline styles. Keep scripts nonce-free
  // and avoid 'unsafe-inline' for script-src.
  "style-src 'self' 'unsafe-inline'",
  // Google reCAPTCHA v3 loads its bootstrap script from google.com and supporting
  // challenge/runtime assets from gstatic.com. Development keeps eval enabled for
  // Next.js tooling only; production omits it.
  `script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/${
    isDevelopment ? " 'unsafe-eval'" : ""
  }`,
  // reCAPTCHA may render verification/challenge frames from google.com or recaptcha.google.com.
  "frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
  // Browser fetches are limited to app routes and reCAPTCHA. Gemini calls currently run
  // server-side through /api/* routes, so generativelanguage.googleapis.com is intentionally
  // not exposed here unless a future browser client calls Gemini directly.
  "connect-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/",
  "font-src 'self' data:",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
