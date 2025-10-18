import { VirtualList } from '@/components/VirtualList';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  cefr_level?: string;
}

interface StudentVirtualListProps {
  students: Student[];
  onViewDetails: (studentId: string) => void;
}

export function StudentVirtualList({ students, onViewDetails }: StudentVirtualListProps) {
  const renderStudent = (student: Student) => (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {student.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{student.full_name}</h3>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {student.cefr_level && (
              <Badge variant="outline">{student.cefr_level}</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(student.id)}
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
      items={students}
      itemHeight={88}
      renderItem={renderStudent}
      containerClassName="h-[600px]"
      overscan={5}
    />
  );
}
