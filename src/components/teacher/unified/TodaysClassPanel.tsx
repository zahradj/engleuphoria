
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Play, Clock, User } from 'lucide-react';

interface ClassItem {
  id: number;
  time: string;
  student: string;
  level: string;
  topic: string;
  status: 'upcoming' | 'ready' | 'live';
  avatar: string;
  duration?: number;
}

interface TodaysClassPanelProps {
  classes: ClassItem[];
  onStartClass: (classId: number, studentName: string) => void;
  onViewStudent: (studentName: string) => void;
}

export function TodaysClassPanel({ 
  classes, 
  onStartClass, 
  onViewStudent 
}: TodaysClassPanelProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500 text-white';
      case 'live': return 'bg-red-500 text-white animate-pulse';
      case 'upcoming': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-300 text-gray-700';
    }
  };

  const getTimeUntil = (timeString: string) => {
    const classTime = new Date();
    const [hours, minutes] = timeString.split(':');
    classTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const now = new Date();
    const diff = classTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    
    if (diffMinutes < 0) return 'Started';
    if (diffMinutes === 0) return 'Starting now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    return `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-blue-200">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="text-blue-500" size={20} />
          Today's Schedule
        </CardTitle>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {classes.length} classes
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {classes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
            <p>No classes scheduled today</p>
          </div>
        ) : (
          classes.map((class_) => (
            <div 
              key={class_.id} 
              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 transition-all duration-200 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex items-center gap-4">
                {/* Student Avatar */}
                <div 
                  className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onViewStudent(class_.student)}
                  title={`View ${class_.student}'s profile`}
                >
                  {class_.avatar}
                </div>
                
                {/* Class Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{class_.time}</span>
                    <Badge variant="outline" className="text-xs">
                      {class_.level}
                    </Badge>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{getTimeUntil(class_.time)}</span>
                  </div>
                  <div className="text-gray-700 font-medium">{class_.student}</div>
                  <div className="text-sm text-gray-600">{class_.topic}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(class_.status)}>
                  {class_.status === 'live' && <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse" />}
                  {class_.status}
                </Badge>
                
                <Button 
                  size="sm" 
                  onClick={() => onStartClass(class_.id, class_.student)}
                  disabled={class_.status === 'upcoming'}
                  className={`transition-all duration-200 ${
                    class_.status === 'ready' 
                      ? 'bg-green-500 hover:bg-green-600 text-white' 
                      : class_.status === 'live'
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Play size={14} className="mr-1" />
                  {class_.status === 'live' ? 'Rejoin' : 'Start'}
                </Button>
              </div>
            </div>
          ))
        )}
        
        {/* Quick Actions */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Clock size={14} className="mr-1" />
              Schedule New
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <User size={14} className="mr-1" />
              View All Students
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
