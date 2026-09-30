import React, { useState } from 'react';
import { FullAdvisoryDetail } from '@shared';
import { SeverityBadge, ConfidenceBadge, PriorityBadge } from '../ui/Badge';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { api } from '../../services/api';
import {
  Printer,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ShieldAlert,
  Sprout,
  Droplets,
  Layers,
  Bug,
  CalendarCheck,
  CheckCircle2,
  PhoneCall,
  Star,
  Info,
  Calendar,
  MapPin,
  ClipboardList,
} from 'lucide-react';

interface AdvisoryResultViewProps {
  advisory: FullAdvisoryDetail;
}

export const AdvisoryResultView: React.FC<AdvisoryResultViewProps> = ({ advisory }) => {
  const { request, result, feedback: initialFeedback } = advisory;
  const [showInputSummary, setShowInputSummary] = useState(false);

  // Feedback state
  const [rating, setRating] = useState<number>(initialFeedback?.rating || 5);
  const [feedbackText, setFeedbackText] = useState<string>(initialFeedback?.feedback || '');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(!!initialFeedback);

  const handlePrint = () => {
    window.print();
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    try {
      await api.advisories.submitFeedback(result.id, {
        rating,
        feedback: feedbackText,
      });
      setFeedbackSuccess(true);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8 advisory-container">
      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-agri-100 text-agri-800">
              {result.category}
            </span>
            <SeverityBadge severity={result.severity} />
            <ConfidenceBadge confidence={result.confidence} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <span>{request.crop_name}</span>
            <span className="text-base font-normal text-stone-500">
              ({request.growth_stage} Stage)
            </span>
          </h1>
          <p className="text-xs text-stone-500 flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              {request.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {formattedDate}
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-3 no-print">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print / Export Advisory
          </Button>
        </div>
      </div>

      {/* Accordion: Farmer's Submitted Telemetry */}
      <div className="bg-stone-100/70 border border-stone-200 rounded-xl overflow-hidden no-print">
        <button
          type="button"
          onClick={() => setShowInputSummary(!showInputSummary)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-semibold text-stone-700 hover:bg-stone-200/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-stone-500" />
            Field Telemetry & Observations Provided
          </span>
          {showInputSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showInputSummary && (
          <div className="px-5 py-4 border-t border-stone-200 bg-white grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="font-semibold text-stone-500 block">Soil Type:</span>
              <span className="text-stone-900">{request.soil_type}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Soil pH:</span>
              <span className="text-stone-900">{request.soil_ph ?? 'Not tested'}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Soil Moisture:</span>
              <span className="text-stone-900">{request.soil_moisture || 'Unspecified'}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Irrigation Method:</span>
              <span className="text-stone-900">{request.irrigation_method}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Recent Rainfall:</span>
              <span className="text-stone-900">{request.recent_rainfall || 'None reported'}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Crop Affected (%):</span>
              <span className="text-stone-900">
                {request.affected_percentage !== null ? `${request.affected_percentage}%` : 'Unspecified'}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-stone-100">
              <span className="font-semibold text-stone-500 block mb-1">Reported Problem:</span>
              <p className="text-stone-800 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200/80">
                "{request.problem_description}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION: SITUATION SUMMARY & CROP ASSESSMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-agri-200">
          <CardHeader
            icon={<Info className="w-5 h-5 text-agri-700" />}
            title="Situation Summary"
            subtitle="Overview of reported agronomic condition"
          />
          <CardContent>
            <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-line">
              {result.situation_summary}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            icon={<Sprout className="w-5 h-5 text-emerald-600" />}
            title="Crop Assessment"
            subtitle="Evidence-based physiological evaluation"
          />
          <CardContent>
            <p className="text-stone-800 text-sm leading-relaxed whitespace-pre-line">
              {result.crop_assessment}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION: POSSIBLE CAUSES */}
      <Card>
        <CardHeader
          icon={<Bug className="w-5 h-5 text-amber-600" />}
          title="Possible Causes & Differential Possibilities"
          subtitle="Conditions that align with observed symptoms (Unconfirmed possibilities)"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.possible_causes.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-stone-900">{item.cause}</h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.likelihood === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : item.likelihood === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {item.likelihood} Likelihood
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.reasoning}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION: RECOMMENDED IMMEDIATE ACTIONS */}
      <Card className="border-agri-300 ring-1 ring-agri-100">
        <CardHeader
          icon={<CheckCircle2 className="w-5 h-5 text-agri-600" />}
          title="Recommended Immediate Actions"
          subtitle="Prioritized cultural and remedial interventions to protect your crop"
        />
        <CardContent>
          <div className="space-y-3.5">
            {result.immediate_actions.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-stone-200/90 shadow-2xs"
              >
                <div className="shrink-0 mt-0.5">
                  <PriorityBadge priority={act.priority} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-stone-900 mb-1">{act.action}</p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    <span className="font-medium text-stone-500">Agronomic rationale: </span>
                    {act.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION: IRRIGATION & SOIL RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Irrigation */}
        <Card>
          <CardHeader
            icon={<Droplets className="w-5 h-5 text-blue-600" />}
            title="Irrigation Recommendations"
            subtitle="Water scheduling and moisture management"
          />
          <CardContent className="space-y-3.5">
            {result.irrigation_recommendations.length > 0 ? (
              result.irrigation_recommendations.map((irr, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-100">
                  <p className="font-semibold text-xs text-blue-950 mb-1">{irr.recommendation}</p>
                  <p className="text-xs text-blue-800/80">{irr.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500">Continue current verified irrigation schedule.</p>
            )}
          </CardContent>
        </Card>

        {/* Soil */}
        <Card>
          <CardHeader
            icon={<Layers className="w-5 h-5 text-earth-600" />}
            title="Soil & Nutrient Recommendations"
            subtitle="pH balance and organic matter health"
          />
          <CardContent className="space-y-3.5">
            {result.soil_recommendations.length > 0 ? (
              result.soil_recommendations.map((soil, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-stone-50 border border-stone-200">
                  <p className="font-semibold text-xs text-stone-900 mb-1">{soil.recommendation}</p>
                  <p className="text-xs text-stone-600">{soil.reason}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-500">No immediate soil adjustments required.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SECTION: PEST & DISEASE CONSIDERATIONS */}
      {result.pest_disease_considerations && result.pest_disease_considerations.length > 0 && (
        <Card>
          <CardHeader
            icon={<Bug className="w-5 h-5 text-rose-600" />}
            title="Pest & Disease Considerations"
            subtitle="Identification indicators and pathogen mitigation protocols"
          />
          <CardContent className="space-y-4">
            {result.pest_disease_considerations.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                <h4 className="font-semibold text-sm text-stone-900">{item.issue}</h4>
                {item.indicators && item.indicators.length > 0 && (
                  <div>
                    <span className="text-xs font-medium text-stone-500 block mb-1">Key indicators to watch for:</span>
                    <ul className="list-disc pl-5 text-xs text-stone-700 space-y-1">
                      {item.indicators.map((ind, indIdx) => (
                        <li key={indIdx}>{ind}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-2 text-xs text-stone-800">
                  <span className="font-semibold text-stone-900">Next Action: </span>
                  {item.next_step}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SECTION: PREVENTIVE MEASURES & MONITORING CHECKLIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            icon={<ShieldAlert className="w-5 h-5 text-agri-700" />}
            title="Preventive & Sustainable Practices"
            subtitle="Long-term crop protection & soil stewardship"
          />
          <CardContent>
            <ul className="space-y-2.5">
              {result.preventive_measures.map((prev, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
                  <span>{prev}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            icon={<CalendarCheck className="w-5 h-5 text-blue-600" />}
            title="Field Monitoring Checklist"
            subtitle="Recommended scouting cadence"
          />
          <CardContent>
            <div className="space-y-2.5">
              {result.monitoring_checklist.map((check, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-xs"
                >
                  <span className="font-medium text-stone-800">{check.item}</span>
                  <span className="shrink-0 font-semibold px-2 py-0.5 rounded bg-white border border-stone-300 text-stone-600 text-[11px]">
                    {check.frequency}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION: SAFETY WARNINGS */}
      {result.warnings && result.warnings.length > 0 && (
        <Alert type="warning" title="Important Agricultural Safety Guidelines">
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            {result.warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* SECTION: LOCAL EXPERT ESCALATION */}
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/60 p-6 flex flex-col md:flex-row items-start gap-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
          <PhoneCall className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base text-amber-950 mb-1">
            When to Consult a Qualified Local Agricultural Expert
          </h3>
          <p className="text-xs md:text-sm text-amber-900 leading-relaxed">
            {result.expert_escalation}
          </p>
        </div>
      </div>

      {/* SECTION: ADDITIONAL INFORMATION NEEDED */}
      {result.additional_information_needed && result.additional_information_needed.length > 0 && (
        <Card className="bg-stone-50/80">
          <CardHeader
            icon={<Info className="w-5 h-5 text-stone-500" />}
            title="Additional Information Needed for Higher Confidence"
            subtitle="To improve certainty in future advisories, consider recording these details"
          />
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.additional_information_needed.map((infoItem, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white border border-stone-300 text-stone-700 shadow-2xs"
                >
                  {infoItem}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION: ADVISORY FEEDBACK WIDGET */}
      <Card className="no-print">
        <CardHeader
          title="Rate This Advisory"
          subtitle="Help us refine agricultural recommendations for your farming region"
        />
        <CardContent>
          {feedbackSuccess ? (
            <Alert type="success" title="Feedback Recorded">
              Thank you for providing your feedback! Your notes assist in continuously refining our agronomic guidance.
            </Alert>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">
                  How practical and clear was this advisory?
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-stone-300 hover:text-amber-400 focus:outline-none transition-colors"
                      aria-label={`Rate ${star} stars`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-stone-500 ml-2 font-medium">({rating} / 5 stars)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Comments or field outcome notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Did this guidance help address the issue in your field?"
                  className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-agri-100 focus:border-agri-600"
                />
              </div>
              <Button type="submit" size="sm" isLoading={isSubmittingFeedback}>
                Submit Farmer Feedback
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
