import { VirtualList } from '@/components/VirtualList';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Star } from 'lucide-react';

interface Teacher {
  id: string;
  full_name: string;
  email: string;
  rating?: number;
  total_lessons?: number;
  specializations?: string[];
}

interface TeacherVirtualListProps {
  teachers: Teacher[];
  onViewDetails: (teacherId: string) => void;
}

export function TeacherVirtualList({ teachers, onViewDetails }: TeacherVirtualListProps) {
  const renderTeacher = (teacher: Teacher) => (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {teacher.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{teacher.full_name}</h3>
                <p className="text-sm text-muted-foreground">{teacher.email}</p>
                {teacher.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {teacher.rating.toFixed(1)} ({teacher.total_lessons || 0} lessons)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {teacher.specializations?.slice(0, 2).map((spec, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {spec}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(teacher.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <VirtualList
      items={teachers}
      itemHeight={96}
      renderItem={renderTeacher}
      containerClassName="h-[600px]"
      overscan={5}
    />
  );
}
