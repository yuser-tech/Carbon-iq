import { generateSustainabilityAdvice } from '@/lib/gemini';

// Mock the Google Generative AI SDK
const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    text: () => JSON.stringify({
      advice: [
        { title: "Test Advice", description: "Test Desc", impact: "High", co2Saving: "1.0 tons" }
      ],
      motivation: "Keep going!"
    })
  }
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: (...args: any[]) => mockGenerateContent(...args),
          startChat: jest.fn().mockReturnValue({
            sendMessage: jest.fn().mockResolvedValue({ response: { text: () => "Hi" } })
          })
        })
      };
    })
  };
});

describe('Recommendation Engine', () => {
  const mockUserData = {
    score: 10,
    breakdown: { transport: 4, energy: 3, diet: 2, shopping: 1 }
  };

  test('generates advice correctly using AI', async () => {
    const suggestions = await generateSustainabilityAdvice(mockUserData);
    expect(suggestions.advice).toHaveLength(1);
    expect(suggestions.advice[0].title).toBe("Test Advice");
  });

  test('handles API errors gracefully with fallback', async () => {
    mockGenerateContent.mockRejectedValueOnce(new Error("API Error"));

    const suggestions = await generateSustainabilityAdvice(mockUserData);
    expect(suggestions.advice).toHaveLength(3); // Default fallbacks
  });

  test('chatWithCoach sends message and returns response', async () => {
    const { chatWithCoach } = require('@/lib/gemini');
    const response = await chatWithCoach("Hello", [{ role: 'user', content: 'Hi' }]);
    expect(response).toBe("Hi");
  });
});
