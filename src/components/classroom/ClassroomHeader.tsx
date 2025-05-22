
import { useLanguage } from "@/contexts/LanguageContext";

interface ClassroomHeaderProps {
  title: string;
  teacher: string;
  time: string;
}

export function ClassroomHeader({ title, teacher, time }: ClassroomHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">
        {teacher} • {time}
      </p>
    </div>
  );
}
