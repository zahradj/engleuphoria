import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, GraduationCap, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SystemId, SYSTEM_THEMES } from '@/types/multiTenant';
import { DashboardRouter } from '@/components/student/dashboards/DashboardRouter';
import { SystemThemeProvider } from '@/contexts/SystemThemeContext';

const DemoShowcase: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<SystemId>('kids');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const systemOptions: { id: SystemId; label: string; icon: React.ReactNode; ages: string; description: string }[] = [
    { 
      id: 'kids', 
      label: 'The Playground', 
      icon: <Baby className="w-5 h-5" />, 
      ages: 'Ages 4-10',
      description: 'Gamified, colorful, map-style navigation'
    },
    { 
      id: 'teen', 
      label: 'The Academy', 
      icon: <GraduationCap className="w-5 h-5" />, 
      ages: 'Ages 11-17',
      description: 'Modern, social-media inspired, dark mode'
    },
    { 
      id: 'adult', 
      label: 'The Hub', 
      icon: <Briefcase className="w-5 h-5" />, 
      ages: 'Adults/Pro',
      description: 'Corporate, clean, minimalist design'
    },
  ];

  const handleSystemChange = (newSystem: SystemId) => {
    if (newSystem === selectedSystem) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedSystem(newSystem);
      setIsTransitioning(false);
    }, 300);
  };

  const handleGraduation = () => {
    const nextSystem = selectedSystem === 'kids' ? 'teen' : selectedSystem === 'teen' ? 'adult' : null;
    if (nextSystem) {
      handleSystemChange(nextSystem);
    }
  };

  const currentTheme = SYSTEM_THEMES[selectedSystem];

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header with System Selector */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  Multi-Tenant Platform Demo
                </h1>
                <p className="text-gray-400 text-sm">
                  Experience how the UI transforms based on student age group
                </p>
              </div>

              {/* System Selector Tabs */}
              <div className="flex gap-2 bg-gray-800/50 p-1 rounded-xl">
                {systemOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSystemChange(option.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      selectedSystem === option.id
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {option.icon}
                    <span className="hidden sm:inline font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current System Info */}
            <motion.div
              key={selectedSystem}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-4 text-sm"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <span className="text-gray-400">Current:</span>
                <span className="text-white font-medium">{currentTheme.name}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <span className="text-gray-400">Target:</span>
                <span className="text-white font-medium">
                  {systemOptions.find(o => o.id === selectedSystem)?.ages}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <span className="text-gray-400">Style:</span>
                <span className="text-white font-medium">
                  {systemOptions.find(o => o.id === selectedSystem)?.description}
                </span>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Dashboard Preview */}
        <div className="relative">
          {/* Graduation Path Indicator */}
          {selectedSystem !== 'adult' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-4 z-40"
            >
              <Button
                onClick={handleGraduation}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Graduate to {selectedSystem === 'kids' ? 'Teen' : 'Adult'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSystem}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className={`${isTransitioning ? 'pointer-events-none' : ''}`}
            >
              <SystemThemeProvider initialSystemId={selectedSystem} demoMode>
                <DashboardRouter
                  systemId={selectedSystem}
                  studentName={selectedSystem === 'kids' ? 'Luna' : selectedSystem === 'teen' ? 'Alex' : 'Sarah'}
                  totalXp={selectedSystem === 'kids' ? 1234 : selectedSystem === 'teen' ? 2340 : 5680}
                  onLevelUp={selectedSystem !== 'adult' ? handleGraduation : undefined}
                />
              </SystemThemeProvider>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="bg-gray-900 border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {systemOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`p-4 rounded-xl transition-all ${
                    selectedSystem === option.id 
                      ? 'bg-white/10 border border-purple-500/50' 
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {option.icon}
                    <span className="font-bold text-white">{option.label}</span>
                  </div>
                  <p className="text-purple-300 text-sm mb-1">{option.ages}</p>
                  <p className="text-gray-400 text-xs">{option.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
              All dashboards pull from the same unified database, filtered by target_system
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DemoShowcase;
