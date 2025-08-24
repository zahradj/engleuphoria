
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  X,
  BarChart3, 
  Brain,
  Calendar, 
  Users, 
  Clock, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  GraduationCap,
  Book,
  FolderOpen
} from "lucide-react";
import { Link } from "react-router-dom";

interface MobileTeacherNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  teacherName: string;
}

export function MobileTeacherNav({ activeTab, setActiveTab, onLogout, teacherName }: MobileTeacherNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, type: 'tab' },
    { id: 'ai-assistant', label: 'AI Curriculum', icon: Brain, type: 'tab' },
    { id: 'placement-test', label: 'Placement Test', icon: GraduationCap, type: 'tab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, type: 'tab' },
    { id: 'students', label: 'Students', icon: Users, type: 'tab' },
    { id: 'reading-library', label: 'Reading Library', icon: Book, type: 'tab' },
    { id: 'curriculum', label: 'Curriculum Library', icon: FolderOpen, type: 'page', path: '/curriculum-library' },
    { id: 'history', label: 'Lesson History', icon: Clock, type: 'tab' },
    { id: 'assignments', label: 'Assignments', icon: FileText, type: 'tab' },
    { id: 'resources', label: 'Resources', icon: BookOpen, type: 'tab' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, type: 'tab' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, type: 'tab' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, type: 'tab' },
    { id: 'settings', label: 'Settings', icon: Settings, type: 'tab' }
  ];

  const handleTabClick = (item: any) => {
    if (item.type === 'tab') {
      setActiveTab(item.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b md:hidden bg-gradient-to-r from-surface-2 to-muted border-border/50">
      {/* Logo and Teacher Info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
          <GraduationCap className="h-4 w-4 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-sm bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Engleuphoria
          </h1>
          <p className="text-xs text-text-muted">{teacherName}</p>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Teacher Panel</h2>
                  <Badge variant="secondary" className="mt-1">
                    {teacherName}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                
                if (item.type === 'page') {
                  return (
                    <Link key={item.id} to={item.path} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-left"
                      >
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                }
                
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start h-12 text-left"
                    onClick={() => handleTabClick(item)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                className="w-full justify-start h-12"
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
