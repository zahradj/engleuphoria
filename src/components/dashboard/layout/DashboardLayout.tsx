import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-dashboard-bg ${className}`}>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
};

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  children,
  className = ""
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {children}
    </section>
  );
};

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`bg-dashboard-surface border border-dashboard-border rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};