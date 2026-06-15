'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Zap, Utensils, ShoppingBag, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-eco-gradient text-foreground flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-green/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest-green/20 rounded-full blur-3xl animate-float" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8 border border-sage/20">
          <Leaf className="w-4 h-4 text-sage" />
          <span className="text-sm font-medium text-sage">Empowering a Greener Future</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Track Your Impact. <br />
          <span className="text-gradient">Heal the Planet.</span>
        </h1>

        <p className="text-lg md:text-xl text-sage/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The premium AI-powered platform to understand, track, and reduce your carbon footprint through personalized insights and simple actions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link href="/calculator">
            <button className="px-8 py-4 rounded-xl bg-emerald-green text-white font-semibold hover:bg-emerald-600 transition-all flex items-center shadow-lg shadow-emerald-900/20">
              Calculate Your Impact <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </Link>
          <button className="px-8 py-4 rounded-xl glass text-sage font-semibold hover:bg-white/5 transition-all">
            Explore Features
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-emerald" />}
            title="Understand"
            desc="Deep dive into your emissions breakdown."
          />
          <FeatureCard 
            icon={<Utensils className="w-6 h-6 text-emerald" />}
            title="Track"
            desc="Monitor your sustainability journey daily."
          />
          <FeatureCard 
            icon={<ShoppingBag className="w-6 h-6 text-emerald" />}
            title="Reduce"
            desc="AI-driven plans to lower your footprint."
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 glass-card text-left"
    >
      <div className="mb-4 p-3 w-fit rounded-lg bg-emerald/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sage/60 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
