import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Video, Wifi, Sparkles } from "lucide-react";

interface ModernClassroomLayoutProps {
  children: React.ReactNode;
  classTime: number;
  participantsCount: number;
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export function ModernClassroomLayout({ 
  children, 
  classTime, 
  participantsCount,
  isConnected,
  connectionQuality
}: ModernClassroomLayoutProps) {
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-info';
      case 'poor': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-surface-2 to-surface-3 overflow-hidden relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-100 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-20 right-20 w-24 h-24 rounded-full bg-accent-200 opacity-25"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 0, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-40 h-40 rounded-full bg-primary-50 opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Top Status Bar */}
      <motion.div 
        className="relative z-10 p-4 flex items-center justify-between bg-surface/80 backdrop-blur-lg border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2 text-primary-700"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-lg">ESL Classroom</span>
          </motion.div>
          
          <Badge variant="secondary" className="flex items-center gap-1 bg-primary-50 text-primary-700 border-primary-200">
            <Clock className="w-4 h-4" />
            {formatTime(classTime)}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 bg-surface border-border">
            <Users className="w-4 h-4" />
            {participantsCount}
          </Badge>
          
          <Badge 
            variant="outline" 
            className={`flex items-center gap-1 ${getConnectionColor()}`}
          >
            <Wifi className="w-4 h-4" />
            {connectionQuality}
          </Badge>

          {isConnected && (
            <motion.div
              className="w-3 h-3 rounded-full bg-success"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 h-[calc(100vh-80px)] overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-100/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-100/20 to-transparent pointer-events-none" />
    </div>
  );
}