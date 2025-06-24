
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { TeacherProfile } from "@/types/teacher-discovery";

interface TeacherSearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialization: string;
  setSelectedSpecialization: (spec: string) => void;
  selectedAccent: string;
  setSelectedAccent: (accent: string) => void;
  teachers: TeacherProfile[];
  onClearFilters: () => void;
}

export const TeacherSearchFilters: React.FC<TeacherSearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSpecialization,
  setSelectedSpecialization,
  selectedAccent,
  setSelectedAccent,
  teachers,
  onClearFilters,
}) => {
  const getSpecializations = () => {
    const allSpecs = teachers.flatMap(t => t.specializations);
    return [...new Set(allSpecs)];
  };

  const getAccents = () => {
    const allAccents = teachers.map(t => t.accent).filter(Boolean);
    return [...new Set(allAccents)];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
          <SelectTrigger>
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specializations</SelectItem>
            {getSpecializations().map(spec => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedAccent} onValueChange={setSelectedAccent}>
          <SelectTrigger>
            <SelectValue placeholder="Accent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Accents</SelectItem>
            {getAccents().map(accent => (
              <SelectItem key={accent} value={accent}>{accent}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={onClearFilters}
        >
          <Filter className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
