export const GROWTH_STAGES = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Grain/Filling',
  'Maturity',
  'Harvest/Post-harvest',
  'Unknown',
] as const;

export const IRRIGATION_METHODS = [
  'Rainfed',
  'Drip',
  'Sprinkler',
  'Flood',
  'Furrow',
  'Manual',
  'Other',
  'Unknown',
] as const;

export const SOIL_TYPES = [
  'Sandy',
  'Loamy',
  'Clay',
  'Sandy loam',
  'Clay loam',
  'Black soil',
  'Red soil',
  'Alluvial',
  'Lateritic',
  'Other',
  'Unknown',
] as const;

export const SEVERITY_LEVELS = ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'] as const;

export const CONFIDENCE_LEVELS = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const CROP_CATEGORIES = [
  'Cereals & Grains',
  'Legumes & Pulses',
  'Vegetables',
  'Fruits',
  'Oilseeds',
  'Fibers & Cash Crops',
  'Plantation & Spices',
  'Forage & Fodder',
  'Other',
] as const;

export const SOIL_MOISTURE_OPTIONS = [
  'Dry / Low Moisture',
  'Moderately Moist / Optimal',
  'Wet / Saturated',
  'Waterlogged / Flooded',
  'Unknown',
] as const;

export const WATER_AVAILABILITY_OPTIONS = [
  'Abundant / Continuous',
  'Adequate / Scheduled',
  'Limited / Scarse',
  'Severe Drought / None',
  'Unknown',
] as const;

export const ACTION_PRIORITIES = ['immediate', 'soon', 'routine'] as const;
export const CAUSE_LIKELIHOODS = ['low', 'medium', 'high'] as const;
