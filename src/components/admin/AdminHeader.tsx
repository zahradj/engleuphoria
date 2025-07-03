import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your English learning platform</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>
          
          <div className="flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-gray-600" />
            <div className="text-sm">
              <p className="font-medium">{user?.full_name}</p>
              <p className="text-gray-500">Administrator</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};