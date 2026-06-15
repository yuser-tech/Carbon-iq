import { render, screen, fireEvent } from '@testing-library/react';
import ActionCenterPage from '@/app/actions/page';
import { useEcoStore } from '@/store/useEcoStore';

describe('Action Center Component', () => {
  test('renders actions and handles completion', () => {
    render(<ActionCenterPage />);
    
    expect(screen.getByText('Switch to LED Bulbs')).toBeInTheDocument();
    
    const completeBtn = screen.getAllByText('Mark Done')[0];
    fireEvent.click(completeBtn);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(useEcoStore.getState().user.xp).toBeGreaterThan(0);
  });

  test('filters actions by category', () => {
    render(<ActionCenterPage />);
    
    fireEvent.click(screen.getByText(/Diet/i));
    expect(screen.getByText('Meatless Mondays')).toBeInTheDocument();
    expect(screen.queryByText('Switch to LED Bulbs')).not.toBeInTheDocument();
  });
});
