
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Camera, MapPin, Clock } from "lucide-react";
import { useStudentLevel } from '@/hooks/useStudentLevel';
import { cn } from '@/lib/utils';

interface ProfileTabProps {
  studentName: string;
}

const HUB_PROFILE_COLORS: Record<string, {
  iconColor: string;
  avatarBorder: string;
  avatarGradient: string;
  badgeBg: string;
  badgeText: string;
  buttonGradient: string;
}> = {
  playground: {
    iconColor: 'text-orange-500',
    avatarBorder: 'border-orange-300',
    avatarGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600',
  },
  academy: {
    iconColor: 'text-indigo-500',
    avatarBorder: 'border-indigo-300',
    avatarGradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    buttonGradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600',
  },
  professional: {
    iconColor: 'text-emerald-500',
    avatarBorder: 'border-emerald-300',
    avatarGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600',
  },
};

export const ProfileTab = ({ studentName }: ProfileTabProps) => {
  const { studentLevel } = useStudentLevel();
  const hubId = studentLevel || 'playground';
  const colors = HUB_PROFILE_COLORS[hubId] || HUB_PROFILE_COLORS.playground;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className={cn('h-5 w-5', colors.iconColor)} />
            Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className={cn('h-24 w-24 border-4', colors.avatarBorder)}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className={cn(colors.avatarGradient, 'text-white text-2xl font-bold')}>
                  {studentName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={studentName} readOnly />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value="student@example.com" readOnly />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>English Level</Label>
                  <Badge variant="outline" className={cn('mt-2', colors.badgeBg, colors.badgeText)}>
                    A2 - Elementary
                  </Badge>
                </div>
                <div>
                  <Label>Current Course</Label>
                  <Badge variant="outline" className={cn('mt-2', colors.badgeBg, colors.badgeText)}>
                    General English A2
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Algeria, UTC+1</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Member since Dec 2024</span>
                </div>
              </div>
              
              <Button className={colors.buttonGradient}>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
