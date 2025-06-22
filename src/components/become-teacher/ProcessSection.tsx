
import React from 'react';
import { FileText, Video, Users, Award } from "lucide-react";

export const ProcessSection = () => {
  const processSteps = [
    {
      number: 1,
      title: "Apply Online",
      description: "Complete our comprehensive application form",
      icon: FileText
    },
    {
      number: 2,
      title: "Equipment Test",
      description: "Test your equipment and internet connection",
      icon: Video
    },
    {
      number: 3,
      title: "Live Interview",
      description: "Meet with our team for a professional interview",
      icon: Users
    },
    {
      number: 4,
      title: "Start Teaching",
      description: "Get approved and begin your teaching journey",
      icon: Award
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Application Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {processSteps.map((step, index) => (
            <div key={index} className="text-center relative">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-emerald-200 transform -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
