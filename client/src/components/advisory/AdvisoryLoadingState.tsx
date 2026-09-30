import React, { useEffect, useState } from 'react';
import { Sprout, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  cropName: string;
}

const STEPS = [
  { label: 'Synthesizing Soil & Irrigation Parameters', desc: 'Validating moisture levels, drainage constraints, and root aeration...' },
  { label: 'Analyzing Observed Symptoms & Phenology', desc: 'Evaluating leaf discoloration, pest indications, and growth stage risks...' },
  { label: 'Querying Agricultural Knowledge Engine (Gemini AI)', desc: 'Generating evidence-based cause hypotheses and immediate cultural actions...' },
  { label: 'Executing Strict Zod Schema & Safety Normalization', desc: 'Validating chemical precautions, dosage guardrails, and non-hallucination rules...' },
  { label: 'Finalizing Structured Agronomic Advisory', desc: 'Formatting monitoring checklists and local extension escalation triggers...' },
];

export const AdvisoryLoadingState: React.FC<LoadingStateProps> = ({ cropName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / STEPS.length) * 100));

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center">
      {/* Animated Icon */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-agri-100 animate-ping opacity-75" />
        <div className="relative w-20 h-20 rounded-2xl bg-agri-600 text-white flex items-center justify-center shadow-lg">
          <Sprout className="w-10 h-10 animate-bounce" />
        </div>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-2">
        Analyzing {cropName || 'Crop'} Health Data
      </h2>
      <p className="text-sm text-stone-500 max-w-md mx-auto mb-8">
        Our server-side agricultural intelligence engine is analyzing your field inputs with conservative agronomic guardrails.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-stone-100 rounded-full h-2.5 mb-8 overflow-hidden">
        <div
          className="bg-agri-600 h-2.5 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="text-left space-y-4 max-w-lg mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3.5 p-3 rounded-xl transition-colors ${
                isCurrent ? 'bg-agri-50/80 border border-agri-200' : 'opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-agri-600" />
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full border-2 border-agri-600 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isCurrent ? 'text-agri-950 font-bold' : isDone ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-center space-x-2 text-xs text-stone-400">
        <ShieldAlert className="w-4 h-4 text-amber-500" />
        <span>Adherence to safety protocols: no unverified chemicals or speculative diagnoses.</span>
      </div>
    </div>
  );
};
