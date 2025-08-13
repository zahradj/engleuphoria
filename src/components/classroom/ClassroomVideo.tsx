
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic } from "lucide-react";

interface ClassroomVideoProps {
  teacher: string;
}

export function ClassroomVideo({ teacher }: ClassroomVideoProps) {
  const { languageText } = useLanguage();
  
  return (
    <div className="relative bg-gradient-to-br from-muted/50 to-muted rounded-2xl aspect-video overflow-hidden video-frame-enhanced glass-subtle rgb-video-frame">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="h-24 w-24 bg-gradient-to-br from-teacher/20 to-teacher-accent/30 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg ring-2 ring-teacher/20">
            <span className="text-3xl font-bold text-teacher">T</span>
          </div>
          <p className="font-semibold text-foreground text-lg">{teacher}</p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 glass-subtle px-4 py-2 rounded-xl text-sm font-medium shadow-lg">
        <span className="bg-gradient-to-r from-teacher to-teacher-accent bg-clip-text text-transparent">Teacher</span>
      </div>
      
      <div className="absolute bottom-4 left-4">
        <div className="glass-subtle px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg">
          <Mic size={16} className="text-secondary animate-pulse" />
          <span className="text-foreground">{languageText.speaking}...</span>
        </div>
      </div>
    </div>
  );
}
