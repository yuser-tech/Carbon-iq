/**
 * Comprehensive Type Definitions for CarbonIQ AI
 * Provides type safety across the entire application
 */

/**
 * Emission breakdown categories
 */
export interface EmissionBreakdown {
  transport: number;
  energy: number;
  diet: number;
  shopping: number;
}

/**
 * Calculator input types
 */
export type FuelType = 'petrol' | 'ev' | 'none';
export type DietType = 'heavy' | 'medium' | 'vegetarian' | 'vegan';
export type ActionCategory = 'transport' | 'energy' | 'diet' | 'shopping';
export type ImpactLevel = 'High' | 'Medium' | 'Low';

/**
 * Calculator inputs for carbon footprint estimation
 */
export interface TransportInputs {
  carDistance: number;
  fuelType: FuelType;
  busHours: number;
  flights: number;
}

export interface EnergyInputs {
  monthlyBill: number;
  isRenewable: boolean;
}

export interface DietInputs {
  type: DietType;
}

export interface ShoppingInputs {
  monthlyClothes: number;
  annualGadgets: number;
}

export interface CalculatorInputs {
  transport: TransportInputs;
  energy: EnergyInputs;
  diet: DietInputs;
  shopping: ShoppingInputs;
}

/**
 * Carbon footprint calculation results
 */
export interface CarbonCalculationResult {
  total: number;
  breakdown: EmissionBreakdown;
}

/**
 * User goal structure
 */
export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'reduction' | 'habit';
  unit: string;
  createdAt: string;
  deadline?: string;
}

/**
 * User badge structure
 */
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  requirement: (stats: UserStats) => boolean;
}

/**
 * Statistics used for badge requirements
 */
export interface UserStats {
  onboarded: boolean;
  score: number;
  completedActions: string[];
  streak: number;
  level: number;
}

/**
 * History entry for tracking changes over time
 */
export interface HistoryEntry {
  date: string;
  score: number;
  breakdown: EmissionBreakdown;
}

/**
 * Eco action structure
 */
export interface EcoAction {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  impact: ImpactLevel;
  co2Saving: number;
  xpReward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeRequired: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
}

/**
 * User data structure stored in the application
 */
export interface UserData {
  onboarded: boolean;
  score: number;
  breakdown: EmissionBreakdown;
  history: HistoryEntry[];
  goals: Goal[];
  completedActions: string[];
  badges: string[];
  xp: number;
  level: number;
  streak: number;
  lastUpdate: string;
  theme: Theme;
  habits: Habit[];
  milestones: Milestone[];
}

/**
 * Theme preference
 */
export type Theme = 'dark' | 'light';

/**
 * Habit tracking structure
 */
export interface Habit {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: string[];
  targetDays: number;
  streak: number;
  impactScore: number;
}

/**
 * Milestone achievements
 */
export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: 'score' | 'streak' | 'habit' | 'action' | 'xp';
  threshold: number;
  achievedAt?: string;
  icon: string;
}

/**
 * Sustainability score engine result
 */
export interface SustainabilityScore {
  carbonScore: number;
  sustainabilityGrade: string;
  improvementPotential: number;
  progressTrend: 'improving' | 'stable' | 'declining';
  breakdown: {
    score: number;
    grade: string;
    maxScore: number;
    category: ActionCategory;
  }[];
}

/**
 * Action impact forecast
 */
export interface ActionImpact {
  actionId: string;
  estimatedCO2Reduction: number;
  timeRequired: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  annualImpact: number;
  monthlyImpact: number;
  tips: string[];
}

/**
 * Reduction roadmap plan
 */
export interface RoadmapPlan {
  period: '30-days' | '90-days' | '1-year';
  title: string;
  description: string;
  milestones: RoadmapMilestone[];
  totalEstimatedReduction: number;
  actions: EcoAction[];
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  week: number;
  targetReduction: number;
  completed: boolean;
}

/**
 * AI Coach message
 */
export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

/**
 * Sustainability insight
 */
export interface SustainabilityInsight {
  id: string;
  type: 'high_emission' | 'improvement_opportunity' | 'positive_change' | 'tip';
  title: string;
  description: string;
  category: ActionCategory;
  impact: number;
  actionable: boolean;
  actionItems?: string[];
}

/**
 * Journey timeline entry
 */
export interface JourneyEntry {
  id: string;
  date: string;
  type: 'assessment' | 'milestone' | 'improvement' | 'badge' | 'action';
  title: string;
  description: string;
  value?: number;
  icon: string;
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

/**
 * Loading state types
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * API response types
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ChatApiRequest {
  message: string;
  history: ChatMessage[];
  recaptchaToken: string;
}

export interface ChatApiResponse {
  response: string;
}

export interface SuggestionsRequest {
  userData: {
    score: number;
    breakdown: EmissionBreakdown;
  };
  recaptchaToken: string;
}

export interface SustainabilityAdvice {
  advice: {
    title: string;
    description: string;
    impact: ImpactLevel;
    co2Saving: string;
  }[];
  motivation: string;
}

/**
 * Recaptcha types
 */
export type RecaptchaStatus = 'idle' | 'missing-key' | 'loading' | 'ready' | 'error';

export interface RecaptchaResult {
  executeRecaptcha: (action: string) => Promise<string | null>;
  errorMessage: string | null;
  isReady: boolean;
  status: RecaptchaStatus;
}
