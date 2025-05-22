
import { useLanguage } from "@/contexts/LanguageContext";
import { ResourceCard } from "./ResourceCard";
import { Resource } from "./types";

interface ResourceGridProps {
  resources: Resource[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  const { languageText } = useLanguage();
  
  if (resources.length === 0) {
    return (
      <div className="col-span-2 py-12 text-center text-muted-foreground">
        {languageText.noResourcesFound}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
