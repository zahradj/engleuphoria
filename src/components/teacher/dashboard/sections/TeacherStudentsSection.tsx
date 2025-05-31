
import { StudentsTab } from "../StudentsTab";

interface TeacherStudentsSectionProps {
  handlers: {
    handleFilter: () => void;
    handleAddStudent: () => void;
    handleViewStudentDetails: (studentName: string) => void;
  };
}

export const TeacherStudentsSection = ({ handlers }: TeacherStudentsSectionProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Students</h2>
      <StudentsTab 
        onFilter={handlers.handleFilter}
        onAddStudent={handlers.handleAddStudent}
        onViewStudentDetails={handlers.handleViewStudentDetails}
      />
    </div>
  );
};
