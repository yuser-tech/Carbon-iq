import { render, screen, fireEvent } from '@testing-library/react';
import ActionCenterPage from '@/app/actions/page';
import DashboardPage from '@/app/dashboard/page';
import { useEcoStore } from '@/store/useEcoStore';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/actions',
}));

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  PieChart: ({ children }: any) => <svg>{children}</svg>,
  Pie: ({ children }: any) => <g>{children}</g>,
  Cell: () => <rect />,
  Tooltip: () => <div />,
}));

describe('Dashboard Flow Integration', () => {
  test('completing an action updates XP and Level in dashboard', () => {
    useEcoStore.getState().setUserData({ onboarded: true, xp: 900, level: 1 });
    
    // 1. Render Actions
    const { unmount } = render(<ActionCenterPage />);
    
    // Complete an action worth 150 XP
    fireEvent.click(screen.getAllByText('Mark Done')[0]);
    expect(useEcoStore.getState().user.xp).toBe(1050);
    expect(useEcoStore.getState().user.level).toBe(2);
    
    unmount();
    
    // 2. Render Dashboard
    render(<DashboardPage />);
    expect(screen.getByText('1050 XP')).toBeInTheDocument();
    expect(screen.getByText('Level 2')).toBeInTheDocument();
  });
});
