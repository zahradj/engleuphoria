
import { useLanguage } from "@/contexts/LanguageContext";

interface ClassroomHeaderProps {
  title: string;
  teacher: string;
  time: string;
}

export function ClassroomHeader({ title, teacher, time }: ClassroomHeaderProps) {
  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-surface via-surface-2 to-surface rounded-2xl border border-primary-200 shadow-lg">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent mb-2">
        {title}
      </h1>
      <div className="flex items-center gap-3 text-text-muted">
        <span className="px-3 py-1 bg-primary-100 rounded-full text-primary-700 font-medium text-sm">
          {teacher}
        </span>
        <span className="text-sm">•</span>
        <span className="text-sm">{time}</span>
      </div>
    </div>
  );
}
