import React from 'react';
import { MobileAwarePage } from '@/components/mobile/MobileAwarePage';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Award } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <MobileAwarePage title="Profile">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarFallback className="text-lg">
                {user?.email?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">
              {user?.email?.split('@')[0] || 'Student'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm capitalize">
                Student
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Member since {new Date(user?.created_at || '').toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Level 1 - Beginner</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Your learning analytics and progress tracking will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileAwarePage>
  );
};

export default ProfilePage;