import { motion } from 'framer-motion';
import { getCarbonGrade } from '@/lib/emissions';

export default function ScoreCard({ score }: { score: number }) {
  const grade = getCarbonGrade(score);
  
  return (
    <div className="glass-card p-8 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <span className="text-4xl font-black text-emerald/20">{grade}</span>
      </div>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96" cy="96" r="80"
            fill="transparent"
            stroke="rgba(165, 214, 167, 0.1)"
            strokeWidth="12"
          />
          <motion.circle
            cx="96" cy="96" r="80"
            fill="transparent"
            stroke="#1B5E20"
            strokeWidth="12"
            strokeDasharray={502.4}
            initial={{ strokeDashoffset: 502.4 }}
            animate={{ strokeDashoffset: 502.4 - (Math.min(score, 20) / 20) * 502.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-xs text-sage/60 uppercase tracking-widest">Tons CO₂ / Year</span>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sage font-medium">Your Carbon Footprint</p>
        <p className="text-xs text-sage/40 mt-1">Based on your recent assessment</p>
      </div>
    </div>
  );
}
