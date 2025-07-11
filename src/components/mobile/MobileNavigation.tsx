import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/ai-tutor', icon: MessageCircle, label: 'AI Tutor' },
  { href: '/classroom', icon: BookOpen, label: 'Classroom' },
  { href: '/gamification', icon: Trophy, label: 'Rewards' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex justify-around items-center py-2 px-4">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200",
                "min-w-0 flex-1 touch-manipulation",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};