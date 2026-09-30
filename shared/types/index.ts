import {
  AdvisoryRequestInput,
  AdvisoryResponseData,
  FeedbackInput,
  PaginationQuery,
} from '../schemas/advisory.js';
import { RegisterInput, LoginInput, ProfileUpdateInput } from '../schemas/auth.js';

export * from '../constants/agriculture.js';
export * from '../schemas/auth.js';
export * from '../schemas/advisory.js';

// User Entity
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  preferredLanguage: string;
  createdAt: string;
  updatedAt: string;
}

// User without sensitive data
export type SafeUser = Omit<User, 'password_hash'>;

// Advisory Request Entity (DB record)
export interface AdvisoryRequestRecord {
  id: string;
  user_id: string;
  crop_category: string | null;
  crop_name: string;
  crop_variety: string | null;
  growth_stage: string;
  location: string;
  state_region: string | null;
  country: string | null;
  cultivated_area: number | null;
  soil_type: string;
  soil_ph: number | null;
  soil_moisture: string | null;
  organic_matter_status: string | null;
  soil_test_information: string | null;
  irrigation_method: string;
  irrigation_frequency: string | null;
  water_availability: string | null;
  last_irrigation_at: string | null;
  recent_rainfall: string | null;
  temperature: string | null;
  humidity: string | null;
  weather_observations: string | null;
  unusual_weather: string | null;
  visible_symptoms: string | null;
  affected_plant_parts: string | null;
  affected_percentage: number | null;
  symptom_duration: string | null;
  pest_observations: string | null;
  disease_observations: string | null;
  weed_observations: string | null;
  fertilizers_used: string | null;
  pesticides_used: string | null;
  organic_inputs: string | null;
  previous_treatments: string | null;
  problem_description: string;
  created_at: string;
}

// Advisory Result Entity (DB record)
export interface AdvisoryResultRecord {
  id: string;
  advisory_request_id: string;
  category: string;
  secondary_categories: string[];
  situation_summary: string;
  crop_assessment: string;
  possible_causes: AdvisoryResponseData['possible_causes'];
  immediate_actions: AdvisoryResponseData['immediate_actions'];
  irrigation_recommendations: AdvisoryResponseData['irrigation_recommendations'];
  soil_recommendations: AdvisoryResponseData['soil_recommendations'];
  pest_disease_considerations: AdvisoryResponseData['pest_disease_considerations'];
  preventive_measures: string[];
  monitoring_checklist: AdvisoryResponseData['monitoring_checklist'];
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  warnings: string[];
  expert_escalation: string;
  additional_information_needed: string[];
  ai_model: string | null;
  ai_raw_response: any;
  created_at: string;
}

// Advisory Feedback Entity (DB record)
export interface AdvisoryFeedbackRecord {
  id: string;
  advisory_result_id: string;
  user_id: string;
  rating: number;
  feedback: string | null;
  created_at: string;
}

// Combined Full Advisory Detail for UI
export interface FullAdvisoryDetail {
  request: AdvisoryRequestRecord;
  result: AdvisoryResultRecord;
  feedback?: AdvisoryFeedbackRecord | null;
}

// Dashboard statistics interface
export interface DashboardStats {
  totalAdvisories: number;
  cropsAnalyzed: number;
  highRiskCount: number;
  recentAdvisories: Array<{
    id: string;
    cropName: string;
    growthStage: string;
    location: string;
    severity: string;
    category: string;
    createdAt: string;
    situationSummary: string;
  }>;
}

// API Response generic wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}
