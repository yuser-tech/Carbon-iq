'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function BreakdownChart({ breakdown }: { breakdown: { transport: number, energy: number, diet: number, shopping: number } }) {
  const data = [
    { name: 'Transport', value: breakdown.transport, color: '#1B5E20' },
    { name: 'Energy', value: breakdown.energy, color: '#4CAF50' },
    { name: 'Diet', value: breakdown.diet, color: '#A5D6A7' },
    { name: 'Shopping', value: breakdown.shopping, color: '#C9A227' },
  ];

  return (
    <div className="glass-card p-6 h-full min-h-[300px] flex flex-col">
      <h3 className="text-xl font-bold mb-6">Emissions Breakdown</h3>
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ background: '#0F2E22', border: '1px solid #1B5E20', borderRadius: '8px' }}
              itemStyle={{ color: '#F5FFF5' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map(item => (
          <div key={item.name} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-xs text-sage/60">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
