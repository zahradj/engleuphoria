import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Eye } from "lucide-react";

interface StudentRelationship {
  id: string;
  student_id: string;
  relationship_type: string;
  is_primary_contact: boolean;
  can_view_progress: boolean;
  can_book_lessons: boolean;
  can_communicate_teachers: boolean;
  student: {
    id: string;
    full_name: string;
    email: string;
  };
}

interface ParentStudentListProps {
  students: StudentRelationship[];
  onSelectStudent: (studentId: string) => void;
}

export function ParentStudentList({ students, onSelectStudent }: ParentStudentListProps) {
  if (students.length === 0) {
    return (
      <Card className="p-8 text-center">
        <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Students Linked</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any students linked to your account yet.
        </p>
        <p className="text-sm text-muted-foreground">
          Contact support to link your children's accounts.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {students.map((relationship) => (
        <Card key={relationship.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">
                {relationship.student.full_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {relationship.student.email}
              </p>
            </div>
            {relationship.is_primary_contact && (
              <Badge variant="secondary">Primary</Badge>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="capitalize">
                {relationship.relationship_type}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {relationship.can_view_progress && (
                <Badge variant="secondary">View Progress</Badge>
              )}
              {relationship.can_book_lessons && (
                <Badge variant="secondary">Book Lessons</Badge>
              )}
              {relationship.can_communicate_teachers && (
                <Badge variant="secondary">Message Teachers</Badge>
              )}
            </div>
          </div>

          <Button
            onClick={() => onSelectStudent(relationship.student_id)}
            className="w-full"
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Progress
          </Button>
        </Card>
      ))}
    </div>
  );
}
