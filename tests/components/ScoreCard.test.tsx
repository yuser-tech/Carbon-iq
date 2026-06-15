import { render, screen } from '@testing-library/react';
import ScoreCard from '@/components/dashboard/ScoreCard';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    circle: ({ animate, ...props }: any) => <circle {...props} />,
  },
}));

describe('ScoreCard Component', () => {
  test('renders the score and grade correctly', () => {
    render(<ScoreCard score={5.2} />);
    expect(screen.getByText('5.2')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('Tons CO₂ / Year')).toBeInTheDocument();
  });
});
