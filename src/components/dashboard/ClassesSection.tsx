
import { Button } from "@/components/ui/button";
import { ClassCard, ClassInfo } from "@/components/ClassCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function ClassesSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Demo classes
  const classes: ClassInfo[] = [
    {
      id: "class-1",
      title: "Fun with Phonics",
      teacher: "Ms. Johnson",
      time: "Today, 2:00 PM",
      students: 12,
      color: "#9B87F5", // Purple
    },
    {
      id: "class-2",
      title: "Storytelling Hour",
      teacher: "Mr. Thomas",
      time: "Tomorrow, 10:00 AM",
      students: 8,
      color: "#14B8A6", // Teal
    },
    {
      id: "class-3",
      title: "Vocabulary Games",
      teacher: "Ms. Garcia",
      time: "Thursday, 3:30 PM",
      students: 15,
      color: "#F97316", // Orange
    },
  ];
  
  const handleJoinClass = (classId: string) => {
    // In a real app, we'd fetch the class details
    navigate(`/classroom/${classId}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t('upcomingClasses')}</h2>
        <Button variant="ghost" size="sm">
          {t('viewAll')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((classInfo) => (
          <ClassCard
            key={classInfo.id}
            classInfo={classInfo}
            onJoin={handleJoinClass}
          />
        ))}
      </div>
    </div>
  );
}
