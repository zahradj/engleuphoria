
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, Award } from "lucide-react";

export const ValuesSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Learning",
      description: "We believe every child deserves access to quality English education that sparks joy and curiosity."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where children, parents, and teachers connect and grow together."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making English learning accessible to children worldwide, regardless of location or background."
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description: "Committed to the highest standards of educational content and teaching methodologies."
    }
  ];

  return (
    <section className="py-16 px-4 bg-surface-2">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-lg text-muted-foreground">
            The principles that guide everything we do at EnglEuphoria
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <value.icon className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
