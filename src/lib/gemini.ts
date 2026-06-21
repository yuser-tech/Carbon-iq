import { geminiFallback, SAFE_GEMINI_FALLBACK_MESSAGE } from "./geminiFallback";

const defaultAdvice = {
  advice: [
    { title: "Reduce Meat Consumption", description: "Try Meatless Mondays to lower your dietary footprint.", impact: "Medium", co2Saving: "0.5 tons" },
    { title: "Switch to LED Bulbs", description: "Save energy by upgrading your home lighting.", impact: "Low", co2Saving: "0.1 tons" },
    { title: "Use Public Transport", description: "Reducing car usage is the most effective way to lower emissions.", impact: "High", co2Saving: "1.2 tons" }
  ],
  motivation: "Every small action counts towards a greener planet!"
};

type SustainabilityUserData = {
  score: number;
  breakdown: {
    transport: number;
    energy: number;
    diet: number;
    shopping: number;
  };
};

type ChatHistoryMessage = {
  role: string;
  content: string;
};

export const generateSustainabilityAdvice = async (userData: SustainabilityUserData) => {
  const prompt = `
    As a Sustainability Coach for CarbonIQ AI, analyze this user's carbon footprint and provide 3 actionable, personalized recommendations.
    
    User Carbon Footprint: ${userData.score} tons CO2/year.
    Breakdown: 
    - Transport: ${userData.breakdown.transport}
    - Energy: ${userData.breakdown.energy}
    - Diet: ${userData.breakdown.diet}
    - Shopping: ${userData.breakdown.shopping}
    
    Format the response as JSON:
    {
      "advice": [
        { "title": "...", "description": "...", "impact": "High/Medium/Low", "co2Saving": "0.X tons" }
      ],
      "motivation": "..."
    }
  `;

  const text = await geminiFallback.generateContent(prompt);
  if (text === SAFE_GEMINI_FALLBACK_MESSAGE) return defaultAdvice;

  try {
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch {
    return defaultAdvice;
  }
};

export const chatWithCoach = async (message: string, history: ChatHistoryMessage[]) => {
  return geminiFallback.sendChatMessage(message, history);
};
