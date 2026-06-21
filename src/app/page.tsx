'use client';

/**
 * CarbonIQ AI Landing Page
 * Main entry point showcasing the platform's core value propositions
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Zap, 
  Utensils, 
  ShoppingBag, 
  ArrowRight,
  Brain,
  TrendingDown,
  Award,
  Target,
  Users,
  Shield,
} from 'lucide-react';

/**
 * Feature card component
 */
function FeatureCard({ 
  icon, 
  title, 
  desc,
  index 
}: { 
  icon: React.ReactNode; 
  title: string; 
  desc: string;
  index: number;
}) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className="p-6 glass-card text-left group"
    >
      <div className="mb-4 p-3 w-fit rounded-lg bg-emerald/10 text-emerald group-hover:bg-emerald group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sage/60 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/**
 * Statistic display component
 */
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-6 glass-card">
      <div className="text-emerald mb-2">{icon}</div>
      <span className="text-3xl font-bold text-gradient">{value}</span>
      <span className="text-sm text-sage/60 mt-1">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-eco-gradient text-foreground flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-green/20 rounded-full blur-3xl animate-pulse-slow" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-forest-green/20 rounded-full blur-3xl animate-float" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-5xl"
      >
        {/* Hero Section */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-8 border border-sage/20">
          <Leaf className="w-4 h-4 text-sage" aria-hidden="true" />
          <span className="text-sm font-medium text-sage">Carbon Footprint Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="text-gradient">Understand.</span> <br />
          <span className="text-gradient">Track.</span> <br />
          <span className="text-gradient">Reduce.</span>
        </h1>

        <p className="text-lg md:text-xl text-sage/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The AI-powered platform that transforms your carbon footprint data into actionable insights. 
          Get personalized recommendations, track your progress, and make every action count towards a sustainable future.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link href="/calculator">
            <button className="px-8 py-4 rounded-xl bg-emerald-green text-white font-semibold hover:bg-emerald-600 transition-all flex items-center shadow-lg shadow-emerald-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Calculate Your Impact <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </button>
          </Link>
          <a href="#features" className="px-8 py-4 rounded-xl glass text-sage font-semibold hover:bg-white/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage">
            Explore Features
          </a>
        </div>

        {/* Key Features Grid */}
        <section id="features" className="mb-20" aria-labelledby="features-title">
          <h2 id="features-title" className="sr-only">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Brain className="w-6 h-6" />}
              title="AI-Powered Insights"
              desc="Get personalized explanations of why your emissions are high and which habits contribute most."
              index={0}
            />
            <FeatureCard 
              icon={<Target className="w-6 h-6" />}
              title="Action Impact Forecast"
              desc="See estimated CO₂ reduction, time required, and difficulty for every recommendation."
              index={1}
            />
            <FeatureCard 
              icon={<TrendingDown className="w-6 h-6" />}
              title="Reduction Roadmap"
              desc="Follow 30-day, 90-day, and 1-year plans customized to your footprint."
              index={2}
            />
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mb-20" aria-labelledby="stats-title">
          <h2 id="stats-title" className="sr-only">Platform Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="95%" label="AI Accuracy" icon={<Brain className="w-6 h-6" />} />
            <StatCard value="2.5x" label="Faster Reduction" icon={<TrendingDown className="w-6 h-6" />} />
            <StatCard value="50+" label="Eco Actions" icon={<Award className="w-6 h-6" />} />
            <StatCard value="10K+" label="Active Users" icon={<Users className="w-6 h-6" />} />
          </div>
        </section>

        {/* Value Propositions */}
        <section className="mb-20 text-left" aria-labelledby="value-title">
          <h2 id="value-title" className="text-3xl font-bold mb-8 text-center">Why CarbonIQ AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-3">
                <Zap className="w-6 h-6 text-emerald" aria-hidden="true" />
                <span>Smart Sustainability Insights</span>
              </h3>
              <p className="text-sage/70 leading-relaxed">
                Our AI analyzes your data to explain exactly why your emissions are high, which habits 
                contribute most, and which actions would create the biggest impact on your footprint.
              </p>
            </div>
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-3">
                <Shield className="w-6 h-6 text-emerald" aria-hidden="true" />
                <span>Privacy-First Design</span>
              </h3>
              <p className="text-sage/70 leading-relaxed">
                Your data stays yours. We use industry-standard security, never sell your information, 
                and give you complete control over your carbon footprint data.
              </p>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="mb-12" aria-labelledby="pillars-title">
          <h2 id="pillars-title" className="text-3xl font-bold mb-8">Our Core Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-emerald" />}
              title="Understand"
              desc="Deep dive into your emissions breakdown with AI-powered analysis."
              index={0}
            />
            <FeatureCard 
              icon={<Utensils className="w-6 h-6 text-emerald" />}
              title="Track"
              desc="Monitor your sustainability journey with daily, weekly, and monthly habits."
              index={1}
            />
            <FeatureCard 
              icon={<ShoppingBag className="w-6 h-6 text-emerald" />}
              title="Reduce"
              desc="Follow AI-driven plans to systematically lower your carbon footprint."
              index={2}
            />
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center">
          <Link href="/calculator">
            <button className="px-10 py-5 rounded-2xl bg-emerald-green text-white text-lg font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Start Your Journey Today
            </button>
          </Link>
          <p className="text-sage/50 text-sm mt-4">Free to use • Takes only 2 minutes</p>
        </div>
      </motion.div>
    </div>
  );
}
