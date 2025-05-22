
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceFiltersProps {
  selectedType: string | null;
  setSelectedType: (type: string | null) => void;
  selectedLevel: string | null;
  setSelectedLevel: (level: string | null) => void;
}

export function ResourceFilters({
  selectedType,
  setSelectedType,
  selectedLevel,
  setSelectedLevel,
}: ResourceFiltersProps) {
  const { languageText } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2">
      <div>
        <h4 className="text-sm font-medium mb-1">{languageText.type}</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedType === null ? "default" : "outline"}
            onClick={() => setSelectedType(null)}
          >
            {languageText.all}
          </Button>
          <Button
            size="sm"
            variant={selectedType === "pdf" ? "default" : "outline"}
            onClick={() => setSelectedType("pdf")}
          >
            PDF
          </Button>
          <Button
            size="sm"
            variant={selectedType === "video" ? "default" : "outline"}
            onClick={() => setSelectedType("video")}
          >
            {languageText.video}
          </Button>
          <Button
            size="sm"
            variant={selectedType === "audio" ? "default" : "outline"}
            onClick={() => setSelectedType("audio")}
          >
            {languageText.audio}
          </Button>
          <Button
            size="sm"
            variant={selectedType === "interactive" ? "default" : "outline"}
            onClick={() => setSelectedType("interactive")}
          >
            {languageText.interactive}
          </Button>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-1">{languageText.level}</h4>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedLevel === null ? "default" : "outline"}
            onClick={() => setSelectedLevel(null)}
          >
            {languageText.all}
          </Button>
          <Button
            size="sm"
            variant={selectedLevel === "beginner" ? "default" : "outline"}
            onClick={() => setSelectedLevel("beginner")}
          >
            {languageText.beginner}
          </Button>
          <Button
            size="sm"
            variant={selectedLevel === "intermediate" ? "default" : "outline"}
            onClick={() => setSelectedLevel("intermediate")}
          >
            {languageText.intermediate}
          </Button>
          <Button
            size="sm"
            variant={selectedLevel === "advanced" ? "default" : "outline"}
            onClick={() => setSelectedLevel("advanced")}
          >
            {languageText.advanced}
          </Button>
        </div>
      </div>
    </div>
  );
}
