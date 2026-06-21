import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AICoach from '@/components/dashboard/AICoach';

// Mock fetch for the API route
global.fetch = jest.fn();

const mockGrecaptcha = {
  ready: jest.fn((callback: () => void) => callback()),
  execute: jest.fn(() => Promise.resolve('recaptcha-token')),
};

describe('Sustainability Coach Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'site-key';
    window.grecaptcha = mockGrecaptcha;
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    delete window.grecaptcha;
  });

  test('handles user chat interaction', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
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

    expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
      body: JSON.stringify({
        message: 'How can I save CO2?',
        history: [
          { role: 'assistant', content: "Hello! I'm your CarbonIQ AI Coach. How can I help you reduce your footprint today?" },
        ],
        recaptchaToken: 'recaptcha-token',
      }),
    }));
  });

  test('sends message on Enter key press', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ response: 'Enter response' })
    });

    render(<AICoach userData={{}} />);
    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Enter message' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 });

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

  test('displays configuration error when reCAPTCHA site key is missing', () => {
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    render(<AICoach userData={{}} />);

    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('alert')).toHaveTextContent(/NEXT_PUBLIC_RECAPTCHA_SITE_KEY/i);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('displays verification error when token acquisition fails', async () => {
    mockGrecaptcha.execute.mockRejectedValueOnce(new Error('token failed'));

    render(<AICoach userData={{}} />);

    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/unable to verify/i);
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('displays verification error on API 403 response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Forbidden' })
    });

    render(<AICoach userData={{}} />);

    const input = screen.getByPlaceholderText('Ask your coach...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/could not verify/i);
    });
  });
});
