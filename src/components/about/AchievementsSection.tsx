
import React from "react";

export const AchievementsSection = () => {
  const achievements = [
    { number: "50,000+", label: "Happy Students" },
    { number: "1,200+", label: "Certified Teachers" },
    { number: "85+", label: "Countries Reached" },
    { number: "98%", label: "Parent Satisfaction" }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl opacity-90">
            Making a difference in children's lives around the world
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{achievement.number}</div>
              <div className="text-lg opacity-90">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
