export interface EcoAction {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'energy' | 'diet' | 'shopping';
  impact: 'High' | 'Medium' | 'Low';
  co2Saving: number; // tons per year
  xpReward: number;
}

export const ECO_ACTIONS: EcoAction[] = [
  {
    id: 'led-bulbs',
    title: 'Switch to LED Bulbs',
    description: 'Replace all incandescent bulbs with energy-efficient LEDs.',
    category: 'energy',
    impact: 'Low',
    co2Saving: 0.1,
    xpReward: 150,
  },
  {
    id: 'meatless-mondays',
    title: 'Meatless Mondays',
    description: 'Avoid meat consumption every Monday.',
    category: 'diet',
    impact: 'Medium',
    co2Saving: 0.5,
    xpReward: 300,
  },
  {
    id: 'public-transport',
    title: 'Commute via Bus/Train',
    description: 'Replace 2 car commutes per week with public transport.',
    category: 'transport',
    impact: 'High',
    co2Saving: 1.2,
    xpReward: 500,
  },
  {
    id: 'cold-wash',
    title: 'Cold Water Laundry',
    description: 'Wash your clothes in cold water instead of hot.',
    category: 'energy',
    impact: 'Low',
    co2Saving: 0.05,
    xpReward: 100,
  },
  {
    id: 'second-hand',
    title: 'Buy Second Hand',
    description: 'Commit to buying at least 50% of new clothes from thrift stores.',
    category: 'shopping',
    impact: 'Medium',
    co2Saving: 0.3,
    xpReward: 400,
  },
];
