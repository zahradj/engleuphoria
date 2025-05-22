
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ResourceSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ResourceSearch({ searchQuery, setSearchQuery }: ResourceSearchProps) {
  const { languageText } = useLanguage();
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={languageText.searchResources}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
