
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Play, MessageCircle, Clock, Globe } from "lucide-react";
import { TeacherProfile } from "@/types/teacher-discovery";

interface TeacherCardProps {
  teacher: TeacherProfile;
  onWatchIntro: (videoUrl: string) => void;
  onBookTeacher: (teacherId: string) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onWatchIntro,
  onBookTeacher,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={teacher.profile_image_url} />
            <AvatarFallback>
              {teacher.full_name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{teacher.full_name}</h3>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{teacher.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({teacher.total_reviews})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-3 h-3" />
              <span>{teacher.accent}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-3">
          {teacher.bio || "Experienced English teacher ready to help you succeed!"}
        </p>

        <div className="flex flex-wrap gap-1">
          {teacher.specializations.slice(0, 3).map((spec, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
          {teacher.specializations.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{teacher.specializations.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            <Clock className="w-3 h-3 inline mr-1" />
            {teacher.years_experience} years exp.
          </span>
          <span className="font-semibold text-purple-600">
            {teacher.hourly_rate_dzd.toLocaleString()} DZD/hour
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onWatchIntro(teacher.intro_video_url)}
          >
            <Play className="w-3 h-3 mr-1" />
            Watch Intro
          </Button>
          
          <Button
            size="sm"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={() => onBookTeacher(teacher.user_id)}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Book Lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
