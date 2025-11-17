import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden ${className}`}>
      {title && (
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-blue-50">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};
