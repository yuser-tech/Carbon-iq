'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User } from 'lucide-react';

export default function AICoach({ userData }: { userData: any }) {
  const [messages, setMessages] = useState<any[]>([
    { role: 'model', content: "Hello! I'm your CarbonIQ AI Coach. How can I help you reduce your footprint today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "I'm having trouble connecting right now. Try again soon!" }]);
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
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-3 rounded-2xl flex space-x-2 ${
                msg.role === 'user' ? 'bg-emerald text-white' : 'bg-white/5 border border-white/10 text-sage'
              }`}>
                {msg.role === 'model' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.role === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
              </div>
            </motion.div>
          ))}
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
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask your coach..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 focus:border-emerald/50 outline-none"
          />
          <button 
            onClick={sendMessage}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
