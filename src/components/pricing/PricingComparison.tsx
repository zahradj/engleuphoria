
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export const PricingComparison = () => {
  const features = [
    { name: "Monthly Lessons", basic: "4", standard: "8", premium: "Unlimited" },
    { name: "AI Assistant", basic: true, standard: true, premium: true },
    { name: "Homework Tracking", basic: true, standard: true, premium: true },
    { name: "Progress Reports", basic: true, standard: true, premium: true },
    { name: "Priority Support", basic: false, standard: true, premium: true },
    { name: "Completion Certificate", basic: false, standard: true, premium: true },
    { name: "Custom Curriculum", basic: false, standard: false, premium: true },
  ];

  const FeatureCell = ({ value }: { value: boolean | string }) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-center block">{value}</span>;
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-center">Plan Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Features</th>
                <th className="text-center py-3 px-4">Basic</th>
                <th className="text-center py-3 px-4">Standard</th>
                <th className="text-center py-3 px-4">Premium</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 font-medium">{feature.name}</td>
                  <td className="py-3 px-4">
                    <FeatureCell value={feature.basic} />
                  </td>
                  <td className="py-3 px-4">
                    <FeatureCell value={feature.standard} />
                  </td>
                  <td className="py-3 px-4">
                    <FeatureCell value={feature.premium} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
