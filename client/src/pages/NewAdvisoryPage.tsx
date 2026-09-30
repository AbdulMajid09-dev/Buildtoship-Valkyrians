import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvisoryRequestInput } from '@shared';
import { api } from '../services/api';
import { AdvisoryForm } from '../components/advisory/AdvisoryForm';
import { AdvisoryLoadingState } from '../components/advisory/AdvisoryLoadingState';

export const NewAdvisoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submittingCropName, setSubmittingCropName] = useState('');

  const handleFormSubmit = async (data: AdvisoryRequestInput) => {
    setSubmittingCropName(data.cropName);
    setIsLoading(true);
    try {
      const created = await api.advisories.create(data);
      // Navigate to the newly generated advisory detail view
      navigate(`/app/advisories/${created.request.id}`);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  if (isLoading) {
    return <AdvisoryLoadingState cropName={submittingCropName} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
          Request AI Crop Advisory
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
          Provide your crop observations, soil and irrigation parameters. Missing optional fields will not stop the analysis — the AI engine will state uncertainties clearly.
        </p>
      </div>

      <AdvisoryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
    </div>
  );
};
