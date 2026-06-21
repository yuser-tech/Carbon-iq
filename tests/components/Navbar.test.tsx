import { render, screen } from '@testing-library/react';
import Navbar from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@/components/ui/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  test('renders navigation items on dashboard', () => {
    (usePathname as jest.Mock).mockReturnValue('/dashboard');
    render(<Navbar />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Action Center/i)).toBeInTheDocument();
  });

  test('does not render on landing page', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });

  test('does not render on calculator page', () => {
    (usePathname as jest.Mock).mockReturnValue('/calculator');
    const { container } = render(<Navbar />);
    expect(container).toBeEmptyDOMElement();
  });
});
