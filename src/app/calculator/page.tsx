'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Zap, Utensils, ShoppingBag, ArrowRight, ArrowLeft, Leaf } from 'lucide-react';
import { useEcoStore } from '@/store/useEcoStore';
import { calculateTotalEmissions, CalculatorInputs } from '@/lib/emissions';

const steps = [
  { id: 'transport', title: 'Transportation', icon: <Car /> },
  { id: 'energy', title: 'Home Energy', icon: <Zap /> },
  { id: 'diet', title: 'Dietary Habits', icon: <Utensils /> },
  { id: 'shopping', title: 'Lifestyle', icon: <ShoppingBag /> },
];

export default function CalculatorPage() {
  const router = useRouter();
  const setUserData = useEcoStore((state) => state.setUserData);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    transport: { carDistance: 5000, fuelType: 'petrol', busHours: 2, flights: 1 },
    energy: { monthlyBill: 100, isRenewable: false },
    diet: { type: 'medium' },
    shopping: { monthlyClothes: 2, annualGadgets: 1 },
  });

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else finish();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const finish = () => {
    const results = calculateTotalEmissions(inputs);
    setUserData({
      onboarded: true,
      score: results.total,
      breakdown: results.breakdown,
      history: [{ date: new Date().toISOString(), score: results.total, breakdown: results.breakdown }],
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-emerald-green -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((s, i) => (
            <div 
              key={s.id} 
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                i <= currentStep ? 'bg-emerald-green text-white' : 'bg-card text-sage/40'
              }`}
            >
              {i < currentStep ? <Leaf className="w-5 h-5" /> : (i + 1)}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 md:p-12"
          >
            {steps[currentStep] && (
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-emerald/10 rounded-xl text-emerald">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-3xl font-bold">{steps[currentStep].title}</h2>
            </div>
            )}

            {currentStep === 0 && (
              <div className="space-y-6">
                <label className="block">
                  <span className="text-sage/60 mb-2 block">Annual Car Travel (km)</span>
                  <input 
                    type="range" min="0" max="50000" step="500"
                    value={inputs.transport.carDistance}
                    onChange={(e) => setInputs({...inputs, transport: {...inputs.transport, carDistance: Number(e.target.value)}})}
                    className="w-full accent-emerald-green"
                    aria-label="Annual car travel in kilometers"
                  />
                  <div className="flex justify-between text-sm mt-1">
                    <span>0 km</span>
                    <span className="text-emerald font-bold">{inputs.transport.carDistance.toLocaleString()} km</span>
                    <span>50,000 km</span>
                  </div>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['petrol', 'ev', 'none'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInputs({...inputs, transport: {...inputs.transport, fuelType: type as any}})}
                      className={`py-3 rounded-xl border transition-all ${
                        inputs.transport.fuelType === type ? 'bg-emerald-green border-emerald-green' : 'border-white/10 hover:border-emerald/30'
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <label className="block">
                  <span className="text-sage/60 mb-2 block">Monthly Electricity Bill ($)</span>
                  <input 
                    type="number"
                    value={inputs.energy.monthlyBill}
                    onChange={(e) => setInputs({...inputs, energy: {...inputs.energy, monthlyBill: Number(e.target.value)}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl focus:border-emerald/50 outline-none"
                    aria-label="Monthly electricity bill in dollars"
                  />
                </label>
                <button
                  onClick={() => setInputs({...inputs, energy: {...inputs.energy, isRenewable: !inputs.energy.isRenewable}})}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    inputs.energy.isRenewable ? 'bg-emerald-green/20 border-emerald-green' : 'border-white/10'
                  }`}
                >
                  <span>My home uses renewable energy</span>
                  <div className={`w-12 h-6 rounded-full relative transition-all ${inputs.energy.isRenewable ? 'bg-emerald-green' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${inputs.energy.isRenewable ? 'left-7' : 'left-1'}`} />
                  </div>
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'heavy', label: 'Heavy Meat Eater', desc: 'Eat meat most days' },
                  { id: 'medium', label: 'Balanced', desc: 'Meat a few times a week' },
                  { id: 'vegetarian', label: 'Vegetarian', desc: 'No meat, includes dairy' },
                  { id: 'vegan', label: 'Vegan', desc: 'Plant-based only' },
                ].map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => setInputs({...inputs, diet: {type: diet.id as any}})}
                    className={`p-6 rounded-xl border text-left transition-all ${
                      inputs.diet.type === diet.id ? 'bg-emerald-green border-emerald-green' : 'border-white/10 hover:border-emerald/30'
                    }`}
                  >
                    <div className="font-bold mb-1">{diet.label}</div>
                    <div className="text-sm opacity-60">{diet.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <label className="block">
                  <span className="text-sage/60 mb-2 block">New clothes per month</span>
                  <input 
                    type="number"
                    value={inputs.shopping.monthlyClothes}
                    onChange={(e) => setInputs({...inputs, shopping: {...inputs.shopping, monthlyClothes: Number(e.target.value)}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald/50 outline-none"
                    aria-label="Number of new clothes purchased per month"
                  />
                </label>
                <label className="block">
                  <span className="text-sage/60 mb-2 block">New gadgets per year</span>
                  <input 
                    type="number"
                    value={inputs.shopping.annualGadgets}
                    onChange={(e) => setInputs({...inputs, shopping: {...inputs.shopping, annualGadgets: Number(e.target.value)}})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-emerald/50 outline-none"
                    aria-label="Number of new gadgets purchased per year"
                  />
                </label>
              </div>
            )}

            <div className="flex justify-between mt-12">
              <button 
                onClick={prev}
                disabled={currentStep === 0}
                className="flex items-center text-sage disabled:opacity-0 transition-opacity"
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> Back
              </button>
              <button 
                onClick={next}
                className="px-8 py-3 rounded-xl bg-emerald-green text-white font-bold flex items-center hover:bg-emerald-600 transition-all"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
