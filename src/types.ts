export type SessionFormat = 'individual' | 'group' | 'both';
export type IntensityLevel = 'gentle' | 'moderate' | 'immersive' | 'very-gentle';
export type AlignmentLevel = 'Strong Alignment' | 'Good Alignment' | 'Alternative Experience';

export interface YantraSession {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  duration: string;
  price: string;
  sessionType: string[]; // ["individual", "group"]
  intensity: 'gentle' | 'moderate' | 'immersive' | 'very-gentle';
  tags: string[];
  goals: string[];
  suitableFor: string[];
  precautions: string[];
  bookingUrl: string;
  active: boolean;
  instruments?: string[];
  alignmentScore?: number;
  matchReasons?: string[];
}

export interface ConcernCategory {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  concerns: {
    id: string;
    label: string;
    description?: string;
  }[];
}

export interface PersonalGoalOption {
  id: string;
  label: string;
  tagEquivalent: string;
  description: string;
  iconName: string;
}

export interface BackgroundAnswers {
  duration?: string; // "Today" | "A few days" | "A few weeks" | "Longer term"
  intensity?: string; // "Mild" | "Moderate" | "Severe"
  receivingMedicalCare?: string; // "Yes" | "No" | "Prefer not to say"
  recentInjuryOrSurgery?: string; // "Yes" | "No"
  medicalConditions?: string[];
  soundSensitivity?: string;
  hasRedFlags?: string; // "Yes" | "No" (severe, unexplained, chest pain, neurological, fainting)
  firstTimeExperience?: string; // "Yes" | "No"
  preferredEnvironment?: string; // "Private individual session" | "Small group session" | "Group sound bath" | "Yoga + sound experience" | "No preference"
  preferredIntensity?: string; // "Very gentle" | "Gentle" | "Immersive" | "Not sure"
  notes?: string;
}

export interface AssessmentPayload {
  selectedConcerns: string[];
  selectedGoals: string[];
  backgroundAnswers: BackgroundAnswers;
  consentedToHealthDataStorage?: boolean;
}

export interface SafetyCheckResult {
  isSafeToProceed: boolean;
  safetyTitle: string;
  safetyMessage: string;
  guidancePoints: string[];
  allowsGeneralRelaxationExploration: boolean;
}

export interface RecommendationResponse {
  safetyStatus: SafetyCheckResult;
  primaryRecommendation: YantraSession | null;
  alternativeRecommendations: YantraSession[];
  matchingReasons: {
    summary: string;
    details: string[];
    disclaimerSnippet: string;
  };
  alignmentLevel: AlignmentLevel;
  generalDisclaimer: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  concernSummary?: string;
  recommendedSessionId?: string;
  message?: string;
  timestamp?: string;
}

export interface BookingInterest {
  sessionId: string;
  sessionName: string;
  format: string;
  visitorName: string;
  email: string;
  phone?: string;
  preferredTiming?: string;
  specialRequests?: string;
  timestamp?: string;
}
