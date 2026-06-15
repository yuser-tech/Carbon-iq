import { render, screen, fireEvent } from '@testing-library/react';
import CarbonSimulator from '@/components/dashboard/CarbonSimulator';
import { useEcoStore } from '@/store/useEcoStore';

describe('CarbonSimulator Component', () => {
  beforeEach(() => {
    useEcoStore.getState().setUserData({
      score: 10,
      breakdown: { transport: 4, energy: 3, diet: 2, shopping: 1 }
    });
  });

  test('simulates reductions correctly', () => {
    render(<CarbonSimulator />);
    
    expect(screen.getByText('10.00 tons')).toBeInTheDocument();
    
    // Simulate 50% transport reduction
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '50' } });
    
    // 4.0 * 0.5 = 2.0 saved. 10.0 - 2.0 = 8.0.
    expect(screen.getByText('8.00 tons')).toBeInTheDocument();
    expect(screen.getByText(/Annual Saving: 2.00 tons CO₂/)).toBeInTheDocument();
  });

  test('resets simulation', () => {
    render(<CarbonSimulator />);
    const sliders = screen.getAllByRole('slider');
    fireEvent.change(sliders[0], { target: { value: '50' } });
    
    const resetBtn = screen.getByRole('button', { name: '' }); // RotateCcw icon button
    fireEvent.click(resetBtn);
    
    expect(screen.getByText('10.00 tons')).toBeInTheDocument();
  });
});
