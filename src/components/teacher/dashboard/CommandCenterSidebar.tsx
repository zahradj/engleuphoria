import React from 'react';
import { Calendar, FolderOpen, Users, GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type TabType = 'schedule' | 'library' | 'students';

interface CommandCenterSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  teacherName: string;
  onLogout: () => void;
}

const menuItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'library', label: 'Library', icon: FolderOpen },
  { id: 'students', label: 'Students', icon: Users },
];

export const CommandCenterSidebar = ({
  activeTab,
  onTabChange,
  teacherName,
  onLogout,
}: CommandCenterSidebarProps) => {
  const initials = teacherName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      {/* Brand */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">School OS</h1>
            <p className="text-xs text-muted-foreground">Teacher Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{teacherName}</p>
            <p className="text-xs text-muted-foreground">Teacher</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
