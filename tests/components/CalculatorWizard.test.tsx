import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorPage from '@/app/calculator/page';
import { useEcoStore } from '@/store/useEcoStore';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('Calculator Wizard Component', () => {
  test('navigates through steps correctly', async () => {
    render(<CalculatorPage />);
    
    expect(screen.getByText(/Transportation/i)).toBeInTheDocument();
    
    // Step 1: Transport
    fireEvent.click(screen.getByText('EV'));
    const transportSlider = screen.getByRole('slider');
    fireEvent.change(transportSlider, { target: { value: '10000' } });
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Home Energy/i)).toBeInTheDocument());
    
    // Step 2: Energy
    const billInput = screen.getByRole('spinbutton');
    fireEvent.change(billInput, { target: { value: '200' } });
    fireEvent.click(screen.getByText(/My home uses renewable energy/i));
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Dietary Habits/i)).toBeInTheDocument());
    
    // Step 3: Diet
    fireEvent.click(screen.getByText(/Vegan/i));
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Lifestyle/i)).toBeInTheDocument());
    
    // Step 4: Lifestyle
    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '5' } });
    fireEvent.change(inputs[1], { target: { value: '3' } });
    
    // Finish
    fireEvent.click(screen.getByText(/Finish/i));
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
    expect(useEcoStore.getState().user.onboarded).toBe(true);
    expect(useEcoStore.getState().user.score).toBeGreaterThan(0);
  });

  test('can go back to previous step', async () => {
    render(<CalculatorPage />);
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Home Energy/i)).toBeInTheDocument());
    
    fireEvent.click(screen.getByText(/Back/i));
    await waitFor(() => expect(screen.getByText(/Transportation/i)).toBeInTheDocument());
  });
});
