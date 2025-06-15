
import React from "react";

export function EnhancedFloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 4,
    duration: Math.random() * 6 + 8,
    left: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400/30 via-purple-400/20 to-violet-400/30"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: '100%',
            opacity: particle.opacity,
            animation: `float-particle ${particle.duration}s ease-in-out infinite`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
}
