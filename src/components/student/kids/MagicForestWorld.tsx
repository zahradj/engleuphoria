import React from 'react';
import { motion } from 'framer-motion';

interface MagicForestWorldProps {
  children?: React.ReactNode;
}

interface CloudProps {
  top: string;
  size: number;
  speed: number;
  delay: number;
}

interface SwayingTreeProps {
  left?: string;
  right?: string;
  bottom: string;
  size: number;
  color: string;
  delay: number;
}

const Cloud: React.FC<CloudProps> = ({ top, size, speed, delay }) => {
  return (
    <motion.div
      className="absolute bg-white rounded-full opacity-60 blur-md"
      style={{ top, width: size, height: size / 1.8 }}
      initial={{ x: -200, opacity: 0 }}
      animate={{ 
        x: ['-10vw', '110vw'],
        opacity: [0, 0.8, 0.8, 0]
      }} 
      transition={{ 
        duration: speed, 
        repeat: Infinity, 
        ease: "linear", 
        delay: delay 
      }}
    />
  );
};

const SwayingTree: React.FC<SwayingTreeProps> = ({ left, right, bottom, size, color, delay }) => {
  return (
    <motion.div
      className="absolute origin-bottom"
      style={{ left, right, bottom, width: size, height: size }}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ 
        duration: 6, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay
      }}
    >
      <svg viewBox="0 0 100 100" fill={color}>
        <rect x="45" y="60" width="10" height="40" fill="#795548" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="35" cy="60" r="20" />
        <circle cx="65" cy="60" r="20" />
      </svg>
    </motion.div>
  );
};

export const MagicForestWorld: React.FC<MagicForestWorldProps> = ({ children }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-sky-300">
      
      {/* LAYER 1: THE SKY (Gradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#00B4DB] via-[#00B4DB] to-[#E0F7FA] z-0" />

      {/* LAYER 2: THE ATMOSPHERE (God Rays) */}
      <div className="absolute inset-0 z-10 opacity-20 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white to-transparent blur-3xl opacity-50"
          animate={{ rotate: [45, 50, 45] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* LAYER 3: DISTANT CLOUDS (Drifting) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Cloud top="10%" size={120} speed={40} delay={0} />
        <Cloud top="20%" size={180} speed={55} delay={2} />
        <Cloud top="15%" size={100} speed={35} delay={5} />
        <Cloud top="25%" size={140} speed={45} delay={8} />
      </div>

      {/* LAYER 4: MID-GROUND (Hills) */}
      <div className="absolute bottom-0 w-full h-[40%] bg-[#81C784] rounded-t-[50%] scale-150 z-30 shadow-lg" />
      <div className="absolute bottom-[-50px] left-[-20%] w-[140%] h-[30%] bg-[#66BB6A] rounded-t-[100%] z-30" />

      {/* LAYER 5: FOREGROUND TREES (Swaying) */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <SwayingTree left="-50px" bottom="-20px" size={300} color="#2E7D32" delay={0} />
        <SwayingTree right="-80px" bottom="-50px" size={350} color="#1B5E20" delay={1.5} />
        <SwayingTree left="20%" bottom="-100px" size={150} color="#43A047" delay={3} />
        <SwayingTree right="25%" bottom="-80px" size={180} color="#388E3C" delay={2} />
      </div>

      {/* LAYER 6: THE GAME CONTENT */}
      <div className="relative z-50 w-full h-full">
        {children}
      </div>

    </div>
  );
};

export default MagicForestWorld;
