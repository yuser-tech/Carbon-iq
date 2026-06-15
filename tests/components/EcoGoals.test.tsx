import { render, screen } from '@testing-library/react';
import EcoGoals from '@/components/dashboard/EcoGoals';
import { useEcoStore } from '@/store/useEcoStore';

describe('EcoGoals Component', () => {
  test('renders active goals correctly', () => {
    // Current EcoGoals uses mock data internally, but let's test it as is first.
    // If we want to test store integration, we'd update the component to use state.user.goals.
    render(<EcoGoals />);
    expect(screen.getByText('Active Goals')).toBeInTheDocument();
    expect(screen.getByText('Reduce meat consumption')).toBeInTheDocument();
  });
});
