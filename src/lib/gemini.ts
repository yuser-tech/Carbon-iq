import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateSustainabilityAdvice = async (userData: any) => {
  const prompt = `
    As a Sustainability Coach for GreenPulse AI, analyze this user's carbon footprint and provide 3 actionable, personalized recommendations.
    
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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean potential markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      advice: [
        { title: "Reduce Meat Consumption", description: "Try Meatless Mondays to lower your dietary footprint.", impact: "Medium", co2Saving: "0.5 tons" },
        { title: "Switch to LED Bulbs", description: "Save energy by upgrading your home lighting.", impact: "Low", co2Saving: "0.1 tons" },
        { title: "Use Public Transport", description: "Reducing car usage is the most effective way to lower emissions.", impact: "High", co2Saving: "1.2 tons" }
      ],
      motivation: "Every small action counts towards a greener planet!"
    };
  }
};

export const chatWithCoach = async (message: string, history: any[]) => {
  const chat = model.startChat({
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    })),
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
};
