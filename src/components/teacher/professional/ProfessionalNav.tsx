import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  LogOut,
  ChevronDown,
  User,
  Settings,
  DollarSign,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export type ProfessionalTab =
  | 'command-center'
  | 'diagnostic-lab'
  | 'reports'
  | 'schedule'
  | 'analytics'
  | 'lesson-architect'
  | 'earnings'
  | 'account';

interface ProfessionalNavProps {
  activeTab: ProfessionalTab;
  onTabChange: (tab: ProfessionalTab) => void;
  teacherName: string;
  profileImageUrl?: string;
  onLogout: () => void;
}

const navItems: { id: ProfessionalTab; label: string; icon: React.ElementType }[] = [
  { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
  { id: 'diagnostic-lab', label: 'Diagnostic Lab', icon: Users },
  { id: 'lesson-architect', label: 'Lesson Architect', icon: Sparkles },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'earnings', label: 'My Earnings', icon: DollarSign },
];

export const ProfessionalNav: React.FC<ProfessionalNavProps> = ({
  activeTab,
  onTabChange,
  teacherName,
  profileImageUrl,
  onLogout,
}) => {
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Logo size="small" />

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`gap-1.5 text-xs font-medium rounded-lg px-3 h-9 transition-all ${
                    isActive
                      ? 'bg-[#1A237E]/8 text-[#1A237E] font-semibold'
                      : 'text-[#9E9E9E] hover:text-foreground hover:bg-muted/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2 h-9">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={profileImageUrl} alt={teacherName} />
                  <AvatarFallback className="bg-[#1A237E]/10 text-[#1A237E] text-xs font-medium">
                    {getInitials(teacherName)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-xs font-medium text-foreground">
                  {teacherName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onTabChange('account')}>
                <User className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
