import { z } from 'zod';
import {
  GROWTH_STAGES,
  IRRIGATION_METHODS,
  SOIL_TYPES,
  SEVERITY_LEVELS,
  CONFIDENCE_LEVELS,
  ACTION_PRIORITIES,
  CAUSE_LIKELIHOODS,
} from '../constants/agriculture.js';

// User Input Validation Schema
export const AdvisoryRequestSchema = z.object({
  // Required core fields
  cropName: z
    .string()
    .trim()
    .min(2, { message: 'Crop name is required (min 2 characters)' })
    .max(150, { message: 'Crop name must be 150 characters or less' }),
  growthStage: z.enum(GROWTH_STAGES, {
    errorMap: () => ({ message: 'Please select a valid growth stage' }),
  }),
  location: z
    .string()
    .trim()
    .min(2, { message: 'Farming location is required (min 2 characters)' })
    .max(500, { message: 'Location must be 500 characters or less' }),
  soilType: z.enum(SOIL_TYPES, {
    errorMap: () => ({ message: 'Please select a valid soil type' }),
  }),
  irrigationMethod: z.enum(IRRIGATION_METHODS, {
    errorMap: () => ({ message: 'Please select a valid irrigation method' }),
  }),
  problemDescription: z
    .string()
    .trim()
    .min(10, { message: 'Please describe the problem in at least 10 characters' })
    .max(4000, { message: 'Description must not exceed 4000 characters' }),

  // Optional fields
  cropCategory: z.string().trim().max(100).optional().default('Other'),
  cropVariety: z.string().trim().max(150).optional().nullable(),
  stateRegion: z.string().trim().max(150).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  cultivatedArea: z
    .union([z.number().positive().max(1000000), z.nan(), z.null(), z.literal('')])
    .optional()
    .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : null)),
  soilPh: z
    .union([z.number().min(2).max(12), z.nan(), z.null(), z.literal('')])
    .optional()
    .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : null)),
  soilMoisture: z.string().trim().max(100).optional().nullable(),
  organicMatterStatus: z.string().trim().max(100).optional().nullable(),
  soilTestInformation: z.string().trim().max(1000).optional().nullable(),

  irrigationFrequency: z.string().trim().max(150).optional().nullable(),
  waterAvailability: z.string().trim().max(100).optional().nullable(),
  lastIrrigationAt: z.string().trim().max(100).optional().nullable(),

  recentRainfall: z.string().trim().max(255).optional().nullable(),
  temperature: z.string().trim().max(100).optional().nullable(),
  humidity: z.string().trim().max(100).optional().nullable(),
  weatherObservations: z.string().trim().max(1000).optional().nullable(),
  unusualWeather: z.string().trim().max(1000).optional().nullable(),

  visibleSymptoms: z.string().trim().max(1500).optional().nullable(),
  affectedPlantParts: z.string().trim().max(500).optional().nullable(),
  affectedPercentage: z
    .union([z.number().min(0).max(100), z.nan(), z.null(), z.literal('')])
    .optional()
    .transform((val) => (typeof val === 'number' && !isNaN(val) ? val : null)),
  symptomDuration: z.string().trim().max(200).optional().nullable(),
  pestObservations: z.string().trim().max(1000).optional().nullable(),
  diseaseObservations: z.string().trim().max(1000).optional().nullable(),
  weedObservations: z.string().trim().max(1000).optional().nullable(),

  fertilizersUsed: z.string().trim().max(1500).optional().nullable(),
  pesticidesUsed: z.string().trim().max(1500).optional().nullable(),
  organicInputs: z.string().trim().max(1500).optional().nullable(),
  previousTreatments: z.string().trim().max(1500).optional().nullable(),
});

// Strict AI Response Validation Schema
export const AdvisoryResponseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  secondary_categories: z.array(z.string()).default([]),
  situation_summary: z.string().min(1, 'Situation summary is required'),
  crop_assessment: z.string().min(1, 'Crop assessment is required'),
  possible_causes: z
    .array(
      z.object({
        cause: z.string().min(1),
        reasoning: z.string().min(1),
        likelihood: z.enum(CAUSE_LIKELIHOODS),
      })
    )
    .min(1, 'At least one possible cause must be identified'),
  immediate_actions: z
    .array(
      z.object({
        action: z.string().min(1),
        priority: z.enum(ACTION_PRIORITIES),
        reason: z.string().min(1),
      })
    )
    .min(1, 'At least one immediate action must be recommended'),
  irrigation_recommendations: z
    .array(
      z.object({
        recommendation: z.string().min(1),
        reason: z.string().min(1),
      })
    )
    .default([]),
  soil_recommendations: z
    .array(
      z.object({
        recommendation: z.string().min(1),
        reason: z.string().min(1),
      })
    )
    .default([]),
  pest_disease_considerations: z
    .array(
      z.object({
        issue: z.string().min(1),
        indicators: z.array(z.string()).default([]),
        next_step: z.string().min(1),
      })
    )
    .default([]),
  preventive_measures: z.array(z.string()).default([]),
  monitoring_checklist: z
    .array(
      z.object({
        item: z.string().min(1),
        frequency: z.string().min(1),
      })
    )
    .default([]),
  severity: z.enum(SEVERITY_LEVELS),
  confidence: z.enum(CONFIDENCE_LEVELS),
  warnings: z.array(z.string()).default([]),
  expert_escalation: z.string().min(1, 'Expert escalation guidance is required'),
  additional_information_needed: z.array(z.string()).default([]),
});

// Feedback validation schema
export const FeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(1000).optional().nullable(),
});

// UUID param validation schema
export const IDParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ID format' }),
});

// Query pagination & filter schema
export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().trim().optional(),
  severity: z.enum(SEVERITY_LEVELS).optional(),
  crop: z.string().trim().optional(),
});

export type AdvisoryRequestInput = z.infer<typeof AdvisoryRequestSchema>;
export type AdvisoryResponseData = z.infer<typeof AdvisoryResponseSchema>;
export type FeedbackInput = z.infer<typeof FeedbackSchema>;
export type PaginationQuery = z.infer<typeof PaginationSchema>;
