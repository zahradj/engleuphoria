
import React from "react";

interface PricingLayoutProps {
  children: React.ReactNode;
}

export const PricingLayout: React.FC<PricingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
};
