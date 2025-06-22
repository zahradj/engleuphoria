
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const RequirementsSection = () => {
  const requirements = [
    "Native or near-native English proficiency",
    "Bachelor's degree (any field)",
    "TEFL/TESOL certification preferred",
    "Teaching experience (preferred but not required)",
    "Reliable internet connection (minimum 10 Mbps)",
    "Quiet teaching environment",
    "Professional webcam and headset"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Requirements
        </h2>
        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{requirement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
