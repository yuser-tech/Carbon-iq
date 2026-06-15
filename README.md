# GreenPulse AI 🌿

**GreenPulse AI** is a premium, AI-powered Carbon Footprint Awareness Platform designed to help individuals understand, track, and reduce their environmental impact.

Built with **Next.js 15**, **TypeScript**, and **Gemini AI**, it offers a seamless and visually stunning experience for sustainability advocates.

## ✨ Features

- **Multi-Step Carbon Calculator**: An intuitive wizard to estimate your annual emissions across Transportation, Energy, Diet, and Lifestyle.
- **Eco-Glassmorphism Dashboard**: A premium analytics hub with interactive charts, national comparisons, and impact summaries.
- **AI Sustainability Coach**: A dedicated Gemini-powered assistant providing personalized reduction plans and sustainability advice.
- **Action Center**: A gamified hub for logging eco-friendly actions and earning XP.
- **Gamification**: Level up your sustainability rank and earn badges as you lower your footprint.
- **Local Persistence**: All your data stays secure on your device using localStorage and Zustand persistence.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **State Management**: Zustand
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Validation**: Zod
- **Testing**: Jest & React Testing Library

## 🛠️ Setup Instructions

1. **Clone the repository** (or copy the `greenpulse-ai` folder).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env.local` file in the root and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_key_here
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Run Tests**:
   ```bash
   npm run test
   ```

## 🧪 Testing

The project includes a comprehensive testing suite:
- **Unit Tests**: Logic verification for the emissions engine.
- **Component Tests**: UI verification for dashboard widgets and calculator steps.
- **Coverage**: Targets > 90% logic coverage.

## 🛡️ Security

- Environment variables protected.
- Data validation using Zod.
- Secure API routes for AI interactions.
- XSS prevention through React primitives.

---

Designed with ❤️ for a greener planet.
