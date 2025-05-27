
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentItem } from "./StudentItem";
import { Filter, PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudentsTabProps {
  onFilter: () => void;
  onAddStudent: () => void;
  onViewStudentDetails: (studentName: string) => void;
}

export const StudentsTab = ({ onFilter, onAddStudent, onViewStudentDetails }: StudentsTabProps) => {
  const { languageText } = useLanguage();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{languageText.students}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onFilter}>
            <Filter className="mr-2 h-4 w-4" />
            {languageText.filter}
          </Button>
          <Button size="sm" onClick={onAddStudent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {languageText.addStudent}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StudentItem
            name="Alex Johnson"
            level={languageText.intermediate}
            lastClass="2025-05-20"
            progress={78}
            onViewDetails={() => onViewStudentDetails("Alex Johnson")}
          />
          <StudentItem
            name="Maria Garcia"
            level={languageText.beginner}
            lastClass="2025-05-21"
            progress={45}
            onViewDetails={() => onViewStudentDetails("Maria Garcia")}
          />
          <StudentItem
            name="Li Wei"
            level={languageText.advanced}
            lastClass="2025-05-19"
            progress={92}
            onViewDetails={() => onViewStudentDetails("Li Wei")}
          />
          <StudentItem
            name="Sophia Ahmed"
            level={languageText.intermediate}
            lastClass="2025-05-21"
            progress={65}
            onViewDetails={() => onViewStudentDetails("Sophia Ahmed")}
          />
        </div>
      </CardContent>
    </Card>
  );
};
