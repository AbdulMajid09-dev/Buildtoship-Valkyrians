import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';

interface SeverityBadgeProps {
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' | string;
  className?: string;
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  className = '',
  showIcon = true,
}) => {
  const configs: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    LOW: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1" />,
    },
    MODERATE: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Info className="w-3.5 h-3.5 mr-1" />,
    },
    HIGH: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
    },
    CRITICAL: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <ShieldAlert className="w-3.5 h-3.5 mr-1" />,
    },
  };

  const key = (severity || 'MODERATE').toUpperCase();
  const config = configs[key] || configs.MODERATE;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showIcon && config.icon}
      {key} RISK
    </span>
  );
};

export const ConfidenceBadge: React.FC<{
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | string;
  className?: string;
}> = ({ confidence, className = '' }) => {
  const configs: Record<string, { bg: string; text: string; border: string }> = {
    LOW: { bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-300' },
    MEDIUM: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    HIGH: { bg: 'bg-agri-50', text: 'text-agri-700', border: 'border-agri-200' },
  };

  const key = (confidence || 'MEDIUM').toUpperCase();
  const config = configs[key] || configs.MEDIUM;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {key} CONFIDENCE
    </span>
  );
};

export const PriorityBadge: React.FC<{
  priority: 'immediate' | 'soon' | 'routine' | string;
  className?: string;
}> = ({ priority, className = '' }) => {
  const key = (priority || 'soon').toLowerCase();
  const styles: Record<string, string> = {
    immediate: 'bg-red-50 text-red-700 border-red-200',
    soon: 'bg-amber-50 text-amber-700 border-amber-200',
    routine: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border ${
        styles[key] || styles.routine
      } ${className}`}
    >
      {key}
    </span>
  );
};
