
import React from "react";

interface PricingSelectionLayoutProps {
  children: React.ReactNode;
}

export const PricingSelectionLayout: React.FC<PricingSelectionLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};
