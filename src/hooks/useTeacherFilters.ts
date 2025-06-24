
import { useState, useEffect } from "react";
import { TeacherProfile } from "@/types/teacher-discovery";

export const useTeacherFilters = (teachers: TeacherProfile[]) => {
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all-specializations");
  const [selectedAccent, setSelectedAccent] = useState("all-accents");

  console.log('useTeacherFilters hook called with teachers:', teachers.length);

  useEffect(() => {
    console.log('Filter effect triggered:', { searchTerm, selectedSpecialization, selectedAccent });
    filterTeachers();
  }, [teachers, searchTerm, selectedSpecialization, selectedAccent]);

  const filterTeachers = () => {
    console.log('Starting to filter teachers...');
    let filtered = [...teachers];

    if (searchTerm) {
      console.log('Applying search filter:', searchTerm);
      filtered = filtered.filter(teacher =>
        teacher.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.specializations.some(spec => 
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedSpecialization && selectedSpecialization !== "all-specializations") {
      console.log('Applying specialization filter:', selectedSpecialization);
      filtered = filtered.filter(teacher =>
        teacher.specializations.includes(selectedSpecialization)
      );
    }

    if (selectedAccent && selectedAccent !== "all-accents") {
      console.log('Applying accent filter:', selectedAccent);
      filtered = filtered.filter(teacher =>
        teacher.accent === selectedAccent
      );
    }

    console.log('Filtered teachers result:', filtered.length);
    setFilteredTeachers(filtered);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm("");
    setSelectedSpecialization("all-specializations");
    setSelectedAccent("all-accents");
  };

  return {
    filteredTeachers,
    searchTerm,
    setSearchTerm,
    selectedSpecialization,
    setSelectedSpecialization,
    selectedAccent,
    setSelectedAccent,
    clearFilters,
  };
};
