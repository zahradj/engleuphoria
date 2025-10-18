import React from 'react';
import { motion } from 'framer-motion';
import logoImage from '@/assets/engleuphoria-logo.png';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ 
        y: [0, -8, 0],
        scale: [1, 1.05, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Colorful bubble background */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg flex items-center justify-center`}
        animate={{
          boxShadow: [
            "0 4px 20px rgba(168, 85, 247, 0.3)",
            "0 8px 30px rgba(168, 85, 247, 0.5)",
            "0 4px 20px rgba(168, 85, 247, 0.3)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Logo image */}
        <img 
          src={logoImage} 
          alt="EnglEuphoria Logo" 
          className="w-3/4 h-3/4 object-contain filter brightness-0 invert"
        />
      </motion.div>
      
      {/* Pulse effect */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-30`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
