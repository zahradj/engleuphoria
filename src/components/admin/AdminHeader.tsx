import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your English learning platform</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="border-border hover:bg-primary/5">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          
          <Button variant="outline" size="sm" className="relative border-border" disabled>
            <Bell className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'}</p>
              <p className="text-muted-foreground">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="border-border hover:bg-primary/5">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};