import React from 'react';
import { motion } from 'framer-motion';
import { Home, BookOpen, PawPrint, Trophy, Settings } from 'lucide-react';

interface PlaygroundSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'home', icon: Home, label: 'Home', gradient: 'from-rose-300 to-pink-400' },
  { id: 'learn', icon: BookOpen, label: 'Learn', gradient: 'from-sky-300 to-blue-400' },
  { id: 'pet', icon: PawPrint, label: 'My Pet', gradient: 'from-amber-300 to-orange-400' },
  { id: 'badges', icon: Trophy, label: 'Badges', gradient: 'from-yellow-300 to-amber-400' },
  { id: 'settings', icon: Settings, label: 'Settings', gradient: 'from-purple-300 to-violet-400' },
];

export const PlaygroundSidebar: React.FC<PlaygroundSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-20 lg:w-24 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-3 gap-3"
    >
      {sidebarItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <motion.button
            key={item.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(item.id)}
            className={`relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                : 'bg-gray-100/80 hover:bg-gray-200/80'
            }`}
            style={{
              boxShadow: isActive
                ? '0 8px 20px -4px rgba(0, 0, 0, 0.2), inset 0 -3px 8px rgba(0, 0, 0, 0.1)'
                : '0 4px 12px -2px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            {/* 3D effect layer */}
            <div
              className={`absolute inset-0 rounded-2xl ${
                isActive ? 'bg-white/20' : 'bg-white/40'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 60%)',
              }}
            />
            
            <Icon
              className={`w-7 h-7 lg:w-8 lg:h-8 relative z-10 ${
                isActive ? 'text-white drop-shadow-md' : 'text-gray-600'
              }`}
            />
            
            {/* Sparkle effect for active */}
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full shadow-lg"
              />
            )}
          </motion.button>
        );
      })}
    </motion.aside>
  );
};
