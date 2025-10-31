
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Fatima Zahra Djaanine",
      role: "Founder & CEO",
      image: "/lovable-uploads/c22e641a-fede-47a3-8585-e8d1ebdaaf66.png",
      description: "Visionary leader passionate about transforming English education through innovative technology and engaging learning experiences."
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "PhD in Applied Linguistics, specializing in interactive learning methods."
    },
    {
      name: "Emma Rodriguez",
      role: "Learning Experience Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in gamification and child psychology in education."
    },
    {
      name: "David Kim",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Leading the development of our innovative learning platform."
    }
  ];

  return (
    <section className="py-16 px-4 bg-surface">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground">
            Passionate educators and technologists dedicated to your child's success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-soft transition-shadow">
              <CardContent className="p-6">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-bold mb-1">{member.name}</h3>
                <p className="text-accent font-medium mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
