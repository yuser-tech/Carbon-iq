import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Landing Page', () => {
  test('renders hero content and CTA', () => {
    render(<LandingPage />);
    expect(screen.getByText(/Track Your Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Heal the Planet/i)).toBeInTheDocument();
    expect(screen.getByText(/Calculate Your Impact/i)).toBeInTheDocument();
  });
});
