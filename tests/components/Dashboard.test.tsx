import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { useEcoStore } from '@/store/useEcoStore';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/dashboard',
}));

// Mock Recharts to avoid issues with SVG sizing in JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div style={{ width: '100%', height: '100%' }}>{children}</div>,
  PieChart: ({ children }: any) => <svg>{children}</svg>,
  Pie: ({ children }: any) => <g>{children}</g>,
  Cell: () => <rect />,
  Tooltip: () => <div />,
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
    useEcoStore.getState().setUserData({
      onboarded: true,
      score: 5.5,
      breakdown: { transport: 2, energy: 1.5, diet: 1, shopping: 1 },
      xp: 500,
      level: 1,
    });
  });

  test('renders user stats and widgets', () => {
    render(<DashboardPage />);
    expect(screen.getByText('5.5')).toBeInTheDocument();
    expect(screen.getByText('500 XP')).toBeInTheDocument();
    expect(screen.getByText('Emissions Breakdown')).toBeInTheDocument();
    expect(screen.getByText('National Comparison')).toBeInTheDocument();
    expect(screen.getByText('Sustainability Coach')).toBeInTheDocument();
  });

  test('redirects to calculator if not onboarded', () => {
    useEcoStore.getState().setUserData({ onboarded: false });
    render(<DashboardPage />);
    expect(mockPush).toHaveBeenCalledWith('/calculator');
  });
});
