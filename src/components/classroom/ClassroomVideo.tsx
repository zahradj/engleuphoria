
import { useLanguage } from "@/contexts/LanguageContext";
import { Mic } from "lucide-react";

interface ClassroomVideoProps {
  teacher: string;
}

export function ClassroomVideo({ teacher }: ClassroomVideoProps) {
  const { languageText } = useLanguage();
  
  return (
    <div className="relative bg-muted rounded-lg aspect-video overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="h-20 w-20 bg-purple/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-2xl font-bold text-purple">T</span>
          </div>
          <p className="font-medium">{teacher}</p>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        Teacher
      </div>
      
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/50 text-white px-2 py-1 rounded-full flex items-center gap-2 text-sm">
          <Mic size={14} />
          {languageText.speaking}...
        </div>
      </div>
    </div>
  );
}
