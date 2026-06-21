'use client';

import { useCallback, useMemo, useState } from 'react';

type RecaptchaStatus = 'idle' | 'missing-key' | 'loading' | 'ready' | 'error';

type RecaptchaResult = {
  executeRecaptcha: (action: string) => Promise<string | null>;
  errorMessage: string | null;
  isReady: boolean;
  status: RecaptchaStatus;
};

type GoogleRecaptcha = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: GoogleRecaptcha;
  }
}

const recaptchaScriptId = 'google-recaptcha-v3';
const missingKeyMessage = 'Verification is not configured because NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing. Please contact support before submitting this form.';
const scriptLoadMessage = 'Verification could not load. Please check your connection and try again.';
const tokenErrorMessage = 'Unable to verify this request. Please try again before submitting this form.';

let recaptchaScriptPromise: Promise<void> | null = null;

function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

function getExistingScriptState(script: HTMLScriptElement) {
  if (script.dataset.loaded === 'true') return 'loaded';
  if (script.dataset.failed === 'true') return 'failed';
  return 'pending';
}

function loadRecaptchaScript(siteKey: string) {
  if (typeof window === 'undefined') return Promise.reject(new Error(scriptLoadMessage));
  if (window.grecaptcha) return Promise.resolve();

  const existingScript = document.getElementById(recaptchaScriptId) as HTMLScriptElement | null;
  if (existingScript) {
    const existingState = getExistingScriptState(existingScript);
    if (existingState === 'loaded') return Promise.resolve();
    if (existingState === 'failed') return Promise.reject(new Error(scriptLoadMessage));
  }

  if (recaptchaScriptPromise) return recaptchaScriptPromise;

  recaptchaScriptPromise = new Promise<void>((resolve, reject) => {
    const script = existingScript ?? document.createElement('script');

    const handleLoad = () => {
      script.dataset.loaded = 'true';
      script.dataset.failed = 'false';
      resolve();
    };

    const handleError = () => {
      script.dataset.failed = 'true';
      recaptchaScriptPromise = null;
      reject(new Error(scriptLoadMessage));
    };

    script.id = recaptchaScriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });

    if (!existingScript) {
      document.head.appendChild(script);
    }
  });

  return recaptchaScriptPromise;
}

function whenRecaptchaReady() {
  return new Promise<void>((resolve, reject) => {
    if (!window.grecaptcha) {
      reject(new Error(scriptLoadMessage));
      return;
    }

    window.grecaptcha.ready(resolve);
  });
}

export function useRecaptcha(): RecaptchaResult {
  const siteKey = getRecaptchaSiteKey();
  const initialStatus = siteKey ? 'idle' : 'missing-key';
  const [status, setStatus] = useState<RecaptchaStatus>(initialStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(siteKey ? null : missingKeyMessage);

  const executeRecaptcha = useCallback(async (action: string) => {
    if (!siteKey) {
      setStatus('missing-key');
      setErrorMessage(missingKeyMessage);
      return null;
    }

    try {
      setStatus(window.grecaptcha ? 'ready' : 'loading');
      setErrorMessage(null);

      await loadRecaptchaScript(siteKey);
      await whenRecaptchaReady();

      const token = await window.grecaptcha?.execute(siteKey, { action });
      if (!token) {
        throw new Error(tokenErrorMessage);
      }

      setStatus('ready');
      return token;
    } catch (error) {
      const message = error instanceof Error && error.message === scriptLoadMessage ? scriptLoadMessage : tokenErrorMessage;
      setStatus('error');
      setErrorMessage(message);
      return null;
    }
  }, [siteKey]);

  return useMemo(() => ({
    executeRecaptcha,
    errorMessage,
    isReady: status === 'ready',
    status,
  }), [errorMessage, executeRecaptcha, status]);
}
