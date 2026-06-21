'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User } from 'lucide-react';

type ApiMessageRole = 'user' | 'assistant' | 'system';

type ChatMessage = {
  role: ApiMessageRole;
  content: string;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const recaptchaScriptId = 'google-recaptcha-v3';
const tokenErrorMessage = 'Unable to verify this chat request. Please try again.';

function getRecaptchaSiteKey() {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
}

function getMessageTone(role: ApiMessageRole) {
  return role === 'assistant' ? 'model' : role;
}

function loadRecaptchaScript(siteKey: string) {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser unavailable'));
  if (window.grecaptcha) return Promise.resolve();

  const existingScript = document.getElementById(recaptchaScriptId) as HTMLScriptElement | null;
  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('reCAPTCHA script failed to load')), { once: true });
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.id = recaptchaScriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('reCAPTCHA script failed to load')), { once: true });
    document.head.appendChild(script);
  });
}

async function getRecaptchaToken(siteKey: string) {
  await loadRecaptchaScript(siteKey);

  return new Promise<string>((resolve, reject) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(siteKey, { action: 'chat' })
        .then(resolve)
        .catch(() => reject(new Error(tokenErrorMessage)));
    });
  });
}

export default function AICoach({ userData }: { userData: unknown }) {
  void userData;

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm your CarbonIQ AI Coach. How can I help you reduce your footprint today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    const recaptchaSiteKey = getRecaptchaSiteKey();

    if (!recaptchaSiteKey) {
      setErrorMessage('Chat verification is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY and try again.');
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: trimmedInput };
    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setErrorMessage(null);

    try {
      const recaptchaToken = await getRecaptchaToken(recaptchaSiteKey);
      if (!recaptchaToken) {
        throw new Error(tokenErrorMessage);
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput, history, recaptchaToken }),
      });

      if (res.status === 403) {
        setErrorMessage('We could not verify this chat request. Please refresh the page and try again.');
        return;
      }

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const data = (await res.json()) as { response?: string };
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || "I'm having trouble responding right now. Try again soon!" }]);
    } catch (error) {
      setErrorMessage(error instanceof Error && error.message === tokenErrorMessage ? error.message : "I'm having trouble connecting right now. Try again soon!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px] overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-emerald/5">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-gold animate-pulse" />
          <h3 className="font-bold">Sustainability Coach</h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => {
            const messageTone = getMessageTone(msg.role);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${messageTone === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl flex space-x-2 ${
                  messageTone === 'user' ? 'bg-emerald text-white' : 'bg-white/5 border border-white/10 text-sage'
                }`}>
                  {messageTone === 'model' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  {messageTone === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                </div>
              </motion.div>
            );
          })}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald/40 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-emerald/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20">
        {errorMessage && (
          <div className="mb-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100" role="alert">
            {errorMessage}
          </div>
        )}
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your coach..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:border-emerald/50 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald rounded-lg hover:bg-emerald-600 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
