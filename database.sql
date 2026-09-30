-- AI-Powered Agriculture Crop Advisory Assistant
-- Production PostgreSQL Database Schema

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150),
  preferred_language VARCHAR(50) DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: advisory_requests
CREATE TABLE IF NOT EXISTS advisory_requests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_category VARCHAR(100),
  crop_name VARCHAR(150) NOT NULL,
  crop_variety VARCHAR(150),
  growth_stage VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  state_region VARCHAR(150),
  country VARCHAR(100),
  cultivated_area NUMERIC,
  soil_type VARCHAR(100) NOT NULL,
  soil_ph NUMERIC,
  soil_moisture VARCHAR(100),
  organic_matter_status VARCHAR(100),
  soil_test_information TEXT,
  irrigation_method VARCHAR(100) NOT NULL,
  irrigation_frequency VARCHAR(150),
  water_availability VARCHAR(100),
  last_irrigation_at TIMESTAMPTZ,
  recent_rainfall TEXT,
  temperature TEXT,
  humidity TEXT,
  weather_observations TEXT,
  unusual_weather TEXT,
  visible_symptoms TEXT,
  affected_plant_parts TEXT,
  affected_percentage NUMERIC,
  symptom_duration TEXT,
  pest_observations TEXT,
  disease_observations TEXT,
  weed_observations TEXT,
  fertilizers_used TEXT,
  pesticides_used TEXT,
  organic_inputs TEXT,
  previous_treatments TEXT,
  problem_description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: advisory_results
CREATE TABLE IF NOT EXISTS advisory_results (
  id UUID PRIMARY KEY,
  advisory_request_id UUID NOT NULL REFERENCES advisory_requests(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  secondary_categories JSONB DEFAULT '[]'::jsonb,
  situation_summary TEXT NOT NULL,
  crop_assessment TEXT NOT NULL,
  possible_causes JSONB NOT NULL DEFAULT '[]'::jsonb,
  immediate_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  irrigation_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  soil_recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  pest_disease_considerations JSONB NOT NULL DEFAULT '[]'::jsonb,
  preventive_measures JSONB NOT NULL DEFAULT '[]'::jsonb,
  monitoring_checklist JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity VARCHAR(20) NOT NULL,
  confidence VARCHAR(20) NOT NULL,
  warnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  expert_escalation TEXT,
  additional_information_needed JSONB NOT NULL DEFAULT '[]'::jsonb,
  ai_model VARCHAR(100),
  ai_raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: advisory_feedback
CREATE TABLE IF NOT EXISTS advisory_feedback (
  id UUID PRIMARY KEY,
  advisory_result_id UUID NOT NULL REFERENCES advisory_results(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance and data isolation lookups
CREATE INDEX IF NOT EXISTS idx_advisory_requests_user_id ON advisory_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_requests_created_at ON advisory_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_advisory_requests_crop_name ON advisory_requests(crop_name);
CREATE INDEX IF NOT EXISTS idx_advisory_results_advisory_request_id ON advisory_results(advisory_request_id);
CREATE INDEX IF NOT EXISTS idx_advisory_results_severity ON advisory_results(severity);
CREATE INDEX IF NOT EXISTS idx_advisory_results_created_at ON advisory_results(created_at);
CREATE INDEX IF NOT EXISTS idx_advisory_feedback_user_id ON advisory_feedback(user_id);
