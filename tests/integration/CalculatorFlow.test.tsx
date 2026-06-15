import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorPage from '@/app/calculator/page';
import DashboardPage from '@/app/dashboard/page';
import { useEcoStore } from '@/store/useEcoStore';

// Mocking needed for both pages
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/calculator',
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <svg>{children}</svg>,
  Pie: ({ children }: any) => <g>{children}</g>,
  Cell: () => <rect />,
  Tooltip: () => <div />,
}));

describe('Calculator Flow Integration', () => {
  test('completing calculator updates store and reflects in dashboard', async () => {
    // 1. Start with reset state
    useEcoStore.getState().resetData();
    
    // 2. Render Calculator
    render(<CalculatorPage />);
    
    // Step 1: Transport
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Home Energy/i)).toBeInTheDocument());

    // Step 2: Energy
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Dietary Habits/i)).toBeInTheDocument());

    // Step 3: Diet
    fireEvent.click(screen.getByText(/Next/i));
    await waitFor(() => expect(screen.getByText(/Lifestyle/i)).toBeInTheDocument());

    // Step 4: Lifestyle
    fireEvent.click(screen.getByText(/Finish/i));
    
    // 3. Verify Store updated
    const state = useEcoStore.getState();
    expect(state.user.onboarded).toBe(true);
    expect(state.user.score).toBeGreaterThan(0);
    
    // 4. Render Dashboard (Manual mock transition)
    render(<DashboardPage />);
    expect(screen.getByText(state.user.score.toString())).toBeInTheDocument();
  });
});
