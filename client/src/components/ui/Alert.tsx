import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className = '',
}) => {
  const configs = {
    info: {
      bg: 'bg-blue-50/80',
      border: 'border-blue-200',
      text: 'text-blue-900',
      iconText: 'text-blue-600',
      icon: <Info className="w-5 h-5 shrink-0" />,
    },
    success: {
      bg: 'bg-agri-50/80',
      border: 'border-agri-200',
      text: 'text-agri-950',
      iconText: 'text-agri-600',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      text: 'text-amber-950',
      iconText: 'text-amber-600',
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    },
    error: {
      bg: 'bg-red-50/80',
      border: 'border-red-200',
      text: 'text-red-950',
      iconText: 'text-red-600',
      icon: <AlertCircle className="w-5 h-5 shrink-0" />,
    },
  };

  const config = configs[type];

  return (
    <div
      role="alert"
      className={`rounded-xl border p-4 ${config.bg} ${config.border} ${config.text} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={config.iconText}>{config.icon}</div>
        <div className="flex-1 text-sm">
          {title && <h5 className="font-semibold mb-1 text-stone-900">{title}</h5>}
          <div className="text-stone-700 leading-relaxed">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors -mr-1 -mt-1 p-1 rounded-md"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
