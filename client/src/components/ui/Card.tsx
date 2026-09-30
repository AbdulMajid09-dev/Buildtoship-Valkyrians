import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition-all ${
        hover ? 'hover:border-stone-300 hover:shadow-sm cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ title, subtitle, action, className = '', icon }) => {
  return (
    <div className={`px-5 py-4 border-b border-stone-100 flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-center space-x-3">
        {icon && <div className="text-agri-600 shrink-0">{icon}</div>}
        <div>
          <h3 className="font-semibold text-stone-900 text-sm md:text-base">{title}</h3>
          {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-5 py-3 bg-stone-50/75 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 ${className}`}>{children}</div>;
};
