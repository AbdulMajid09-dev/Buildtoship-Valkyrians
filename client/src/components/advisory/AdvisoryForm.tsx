import React, { useState } from 'react';
import {
  GROWTH_STAGES,
  IRRIGATION_METHODS,
  SOIL_TYPES,
  CROP_CATEGORIES,
  SOIL_MOISTURE_OPTIONS,
  WATER_AVAILABILITY_OPTIONS,
} from '@shared';
import { AdvisoryRequestSchema, AdvisoryRequestInput } from '@shared';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Alert } from '../ui/Alert';
import {
  Sprout,
  MapPin,
  Droplets,
  Layers,
  CloudSun,
  Activity,
  Wrench,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AdvisoryFormProps {
  onSubmit: (data: AdvisoryRequestInput) => Promise<void>;
  isLoading: boolean;
}

export const AdvisoryForm: React.FC<AdvisoryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<AdvisoryRequestInput>>({
    cropCategory: 'Vegetables',
    cropName: '',
    cropVariety: '',
    growthStage: 'Vegetative',
    location: '',
    stateRegion: '',
    country: '',
    cultivatedArea: null,
    soilType: 'Loamy',
    soilPh: null,
    soilMoisture: 'Moderately Moist / Optimal',
    organicMatterStatus: '',
    soilTestInformation: '',
    irrigationMethod: 'Drip',
    irrigationFrequency: '',
    waterAvailability: 'Adequate / Scheduled',
    lastIrrigationAt: '',
    recentRainfall: '',
    temperature: '',
    humidity: '',
    weatherObservations: '',
    unusualWeather: '',
    visibleSymptoms: '',
    affectedPlantParts: '',
    affectedPercentage: null,
    symptomDuration: '',
    pestObservations: '',
    diseaseObservations: '',
    weedObservations: '',
    fertilizersUsed: '',
    pesticidesUsed: '',
    organicInputs: '',
    previousTreatments: '',
    problemDescription: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: keyof AdvisoryRequestInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const key = field as string;
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSampleFill = (sampleType: 'tomato' | 'corn') => {
    if (sampleType === 'tomato') {
      setFormData({
        cropCategory: 'Vegetables',
        cropName: 'Tomato',
        cropVariety: 'Roma VF',
        growthStage: 'Flowering',
        location: 'Salinas Valley, California',
        stateRegion: 'California',
        country: 'United States',
        cultivatedArea: 2.5,
        soilType: 'Clay loam',
        soilPh: 6.6,
        soilMoisture: 'Moderately Moist / Optimal',
        organicMatterStatus: 'Moderate (2.5%)',
        soilTestInformation: 'Standard NPK conducted 4 months ago, adequate potassium',
        irrigationMethod: 'Drip',
        irrigationFrequency: 'Twice weekly, 4 hours per cycle',
        waterAvailability: 'Adequate / Scheduled',
        lastIrrigationAt: '2 days ago',
        recentRainfall: 'Light misting last weekend, 5mm',
        temperature: 'Warm days (27°C) with cool nights (14°C)',
        humidity: 'High morning humidity (75-80%)',
        weatherObservations: 'Heavy morning dew persisting until 10 AM',
        unusualWeather: 'Unseasonably overcast for late spring',
        visibleSymptoms: 'Dark brown, concentric ring lesions on lower mature foliage. Mild leaf yellowing and premature leaf drop.',
        affectedPlantParts: 'Lower canopy leaves and stems',
        affectedPercentage: 15,
        symptomDuration: 'First noticed 6 days ago, gradually spreading upwards',
        pestObservations: 'No visible aphids or whiteflies on leaf undersides',
        diseaseObservations: 'Suspected fungal leaf blight',
        weedObservations: 'Minor purslane between raised beds',
        fertilizersUsed: 'Drip-applied calcium nitrate (15.5-0-0) 10 days ago',
        pesticidesUsed: 'None in the current crop cycle',
        organicInputs: 'Composted dairy manure applied pre-transplant',
        previousTreatments: 'None',
        problemDescription: 'Dark concentric spots are appearing on lower foliage and working their way up the plants. Blossoms are still setting well, but leaves are yellowing and dropping around the base.',
      });
    } else {
      setFormData({
        cropCategory: 'Cereals & Grains',
        cropName: 'Maize / Corn',
        cropVariety: 'Yellow Hybrid 302',
        growthStage: 'Vegetative',
        location: 'Highland Ridge Farm, Iowa',
        stateRegion: 'Iowa',
        country: 'United States',
        cultivatedArea: 15,
        soilType: 'Loamy',
        soilPh: 6.8,
        soilMoisture: 'Dry / Low Moisture',
        organicMatterStatus: 'High (3.5%)',
        soilTestInformation: '',
        irrigationMethod: 'Rainfed',
        irrigationFrequency: 'Dependent on rainfall',
        waterAvailability: 'Limited / Scarse',
        lastIrrigationAt: '',
        recentRainfall: 'No rain for 18 days',
        temperature: '33°C peak afternoon',
        humidity: 'Low (35%)',
        weatherObservations: 'Prolonged dry heat and gusty winds',
        unusualWeather: 'Early summer flash drought conditions',
        visibleSymptoms: 'Leaf rolling during mid-day, pale green coloring, stunted height',
        affectedPlantParts: 'Upper and middle leaves',
        affectedPercentage: 40,
        symptomDuration: 'Past 10 days',
        pestObservations: 'Slight thrips damage on leaf tips',
        diseaseObservations: 'None',
        weedObservations: 'Foxtail emergence in field margins',
        fertilizersUsed: 'Pre-plant urea incorporated',
        pesticidesUsed: 'Pre-emergence herbicide',
        organicInputs: 'Cover crop rye rolled before planting',
        previousTreatments: '',
        problemDescription: 'Maize leaves are rolling into tight needles by 11 AM due to 18 days without rain. Top leaves look pale and growth seems completely halted.',
      });
    }
    setErrors({});
    setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate with Zod
    const validation = AdvisoryRequestSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const path = issue.path[0] as string;
        if (path && !fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setGeneralError('Please correct the highlighted fields before submitting.');
      // Scroll to first error
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    try {
      await onSubmit(validation.data);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to submit advisory request. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sample fill bar */}
      <div className="bg-stone-100/80 border border-stone-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-stone-600">
          <Sparkles className="w-4 h-4 text-agri-600 shrink-0" />
          <span>Need a quick test? Pre-fill with typical field scenarios:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSampleFill('tomato')}
            className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-700 transition-colors shadow-2xs"
          >
            Sample Tomato (Blight)
          </button>
          <button
            type="button"
            onClick={() => handleSampleFill('corn')}
            className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-700 transition-colors shadow-2xs"
          >
            Sample Maize (Drought)
          </button>
        </div>
      </div>

      {generalError && (
        <Alert type="error" title="Submission Error">
          {generalError}
        </Alert>
      )}

      {/* SECTION 1: CROP & LOCATION */}
      <Card>
        <CardHeader
          icon={<Sprout className="w-5 h-5 text-agri-600" />}
          title="Crop & Farming Location"
          subtitle="Define what you are cultivating and where your field is situated."
        />
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Select
            label="Crop Category"
            value={formData.cropCategory || 'Other'}
            options={CROP_CATEGORIES}
            onChange={(e) => handleChange('cropCategory', e.target.value)}
          />
          <Input
            label="Crop Name"
            placeholder="e.g. Tomato, Rice, Wheat, Cotton"
            required
            value={formData.cropName || ''}
            error={errors.cropName}
            onChange={(e) => handleChange('cropName', e.target.value)}
          />
          <Input
            label="Variety / Hybrid (Optional)"
            placeholder="e.g. Roma VF, Basmati 370"
            value={formData.cropVariety || ''}
            onChange={(e) => handleChange('cropVariety', e.target.value)}
          />
          <Select
            label="Current Growth Stage"
            required
            value={formData.growthStage || 'Vegetative'}
            options={GROWTH_STAGES}
            error={errors.growthStage}
            onChange={(e) => handleChange('growthStage', e.target.value)}
          />
          <Input
            label="Farming Location"
            placeholder="e.g. Salinas Valley, Punjab, Rift Valley"
            required
            value={formData.location || ''}
            error={errors.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
          <Input
            label="State / Region (Optional)"
            placeholder="e.g. California, Maharashtra"
            value={formData.stateRegion || ''}
            onChange={(e) => handleChange('stateRegion', e.target.value)}
          />
          <Input
            label="Country (Optional)"
            placeholder="e.g. United States, India, Kenya"
            value={formData.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
          />
          <Input
            label="Cultivated Area (Acres/Ha)"
            type="number"
            step="0.1"
            placeholder="e.g. 5"
            value={formData.cultivatedArea !== null && formData.cultivatedArea !== undefined ? formData.cultivatedArea : ''}
            onChange={(e) => handleChange('cultivatedArea', e.target.value === '' ? null : Number(e.target.value))}
          />
        </CardContent>
      </Card>

      {/* SECTION 2: SOIL & IRRIGATION */}
      <Card>
        <CardHeader
          icon={<Droplets className="w-5 h-5 text-blue-600" />}
          title="Soil Profile & Irrigation Method"
          subtitle="Helps the advisory engine evaluate drainage, waterlogging risks, and nutrient availability."
        />
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Select
            label="Soil Type"
            required
            value={formData.soilType || 'Loamy'}
            options={SOIL_TYPES}
            error={errors.soilType}
            onChange={(e) => handleChange('soilType', e.target.value)}
          />
          <Input
            label="Soil pH (If tested, 2.0 - 12.0)"
            type="number"
            step="0.1"
            placeholder="e.g. 6.5"
            value={formData.soilPh !== null && formData.soilPh !== undefined ? formData.soilPh : ''}
            error={errors.soilPh}
            onChange={(e) => handleChange('soilPh', e.target.value === '' ? null : Number(e.target.value))}
          />
          <Select
            label="Current Soil Moisture"
            value={formData.soilMoisture || 'Moderately Moist / Optimal'}
            options={SOIL_MOISTURE_OPTIONS}
            onChange={(e) => handleChange('soilMoisture', e.target.value)}
          />
          <Select
            label="Irrigation Method"
            required
            value={formData.irrigationMethod || 'Drip'}
            options={IRRIGATION_METHODS}
            error={errors.irrigationMethod}
            onChange={(e) => handleChange('irrigationMethod', e.target.value)}
          />
          <Input
            label="Irrigation Frequency"
            placeholder="e.g. Every 3 days, Weekly"
            value={formData.irrigationFrequency || ''}
            onChange={(e) => handleChange('irrigationFrequency', e.target.value)}
          />
          <Select
            label="Water Availability"
            value={formData.waterAvailability || 'Adequate / Scheduled'}
            options={WATER_AVAILABILITY_OPTIONS}
            onChange={(e) => handleChange('waterAvailability', e.target.value)}
          />
          <div className="md:col-span-3">
            <Input
              label="Soil Test / Organic Matter Details (Optional)"
              placeholder="e.g. High organic matter, previous phosphorus deficiency noted on lab report"
              value={formData.soilTestInformation || ''}
              onChange={(e) => handleChange('soilTestInformation', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: WEATHER & CROP HEALTH OBSERVATIONS */}
      <Card>
        <CardHeader
          icon={<CloudSun className="w-5 h-5 text-amber-600" />}
          title="Weather Environment & Visible Symptoms"
          subtitle="Climatic stress and visual symptoms give clues to biotic or abiotic issues."
        />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Recent Rainfall / Moisture"
            placeholder="e.g. Heavy rain 3 days ago, or 3 weeks without rain"
            value={formData.recentRainfall || ''}
            onChange={(e) => handleChange('recentRainfall', e.target.value)}
          />
          <Input
            label="Temperature & Humidity (If observed)"
            placeholder="e.g. 28°C daytime, high relative humidity"
            value={formData.temperature || ''}
            onChange={(e) => handleChange('temperature', e.target.value)}
          />
          <Input
            label="Visible Plant Symptoms"
            placeholder="e.g. Yellowing leaf edges, brown spots with halos, wilting during noon"
            value={formData.visibleSymptoms || ''}
            onChange={(e) => handleChange('visibleSymptoms', e.target.value)}
          />
          <Input
            label="Affected Plant Parts"
            placeholder="e.g. Lower foliage, root collar, fruit skin, terminal shoots"
            value={formData.affectedPlantParts || ''}
            onChange={(e) => handleChange('affectedPlantParts', e.target.value)}
          />
          <Input
            label="Estimated Crop Percentage Affected (%)"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 15"
            value={formData.affectedPercentage !== null && formData.affectedPercentage !== undefined ? formData.affectedPercentage : ''}
            error={errors.affectedPercentage}
            onChange={(e) => handleChange('affectedPercentage', e.target.value === '' ? null : Number(e.target.value))}
          />
          <Input
            label="Symptom Duration"
            placeholder="e.g. Started 4 days ago after heavy rain"
            value={formData.symptomDuration || ''}
            onChange={(e) => handleChange('symptomDuration', e.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Pest, Disease, or Weed Observations"
              placeholder="e.g. Sucking aphids clustered on stems, white fungal powder, or intense broadleaf weed competition"
              value={formData.pestObservations || ''}
              onChange={(e) => handleChange('pestObservations', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: FARMING PRACTICES */}
      <Card>
        <CardHeader
          icon={<Wrench className="w-5 h-5 text-stone-600" />}
          title="Recent Farming Practices & Chemical History"
          subtitle="Helps avoid recommending contradictory treatments or dangerous chemical interactions."
        />
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Fertilizers Recently Applied"
            placeholder="e.g. Urea broadcast 2 weeks ago, NPK 19-19-19"
            value={formData.fertilizersUsed || ''}
            onChange={(e) => handleChange('fertilizersUsed', e.target.value)}
          />
          <Input
            label="Pesticides / Fungicides Used"
            placeholder="e.g. Mancozeb spray 10 days ago, or None"
            value={formData.pesticidesUsed || ''}
            onChange={(e) => handleChange('pesticidesUsed', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* SECTION 5: PRIMARY QUESTION / PROBLEM DESCRIPTION */}
      <Card className="border-agri-200 ring-1 ring-agri-100">
        <CardHeader
          icon={<HelpCircle className="w-5 h-5 text-agri-700" />}
          title="What problem are you facing with your crop?"
          subtitle="Describe the situation in your own words. The AI engine will analyze all variables collectively."
        />
        <CardContent>
          <Textarea
            rows={5}
            maxLength={3000}
            showCount
            required
            placeholder="Describe what is happening to your crop, when you noticed it, any recent changes, and what guidance you are seeking..."
            value={formData.problemDescription || ''}
            error={errors.problemDescription}
            onChange={(e) => handleChange('problemDescription', e.target.value)}
          />
        </CardContent>
        <CardFooter className="bg-agri-50/50 justify-between">
          <div className="flex items-center space-x-2 text-stone-500">
            <ShieldCheck className="w-4 h-4 text-agri-600" />
            <span className="text-xs">Safe, evidence-aware advisory generated server-side</span>
          </div>
          <Button
            type="submit"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Generate Crop Advisory
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};
