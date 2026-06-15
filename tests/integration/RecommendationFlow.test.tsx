import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { useEcoStore } from '@/store/useEcoStore';

global.fetch = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/dashboard',
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <svg>{children}</svg>,
  Pie: ({ children }: any) => <g>{children}</g>,
  Cell: () => <rect />,
  Tooltip: () => <div />,
}));

describe('Recommendation Flow Integration', () => {
  test('Dashboard loads with initial AI greeting', async () => {
    useEcoStore.getState().setUserData({ onboarded: true });
    
    render(<DashboardPage />);
    
    expect(screen.getByText(/I'm your GreenPulse AI Coach/)).toBeInTheDocument();
  });
});
