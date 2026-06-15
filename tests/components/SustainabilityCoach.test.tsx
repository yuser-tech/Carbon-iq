import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AICoach from '@/components/dashboard/AICoach';

// Mock fetch for the API route
global.fetch = jest.fn();

describe('Sustainability Coach Component', () => {
  test('handles user chat interaction', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ response: 'This is an AI response.' })
    });

    render(<AICoach userData={{}} />);
    
    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'How can I save CO2?' } });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('How can I save CO2?')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('This is an AI response.')).toBeInTheDocument();
    });
  });

  test('sends message on Enter key press', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ response: 'Enter response' })
    });

    render(<AICoach userData={{}} />);
    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Enter message' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Enter response')).toBeInTheDocument();
    });
  });

  test('displays error message on API failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<AICoach userData={{}} />);
    
    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument();
    });
  });
});
