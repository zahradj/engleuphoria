
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TeacherProfile } from "@/types/teacher-discovery";
import { mockTeachers } from "@/data/mock-teachers";
import { TeacherSearchFilters } from "@/components/teacher-discovery/TeacherSearchFilters";
import { TeacherCard } from "@/components/teacher-discovery/TeacherCard";
import { useTeacherFilters } from "@/hooks/useTeacherFilters";

const TeacherDiscovery = () => {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('TeacherDiscovery component rendering...');

  const {
    filteredTeachers,
    searchTerm,
    setSearchTerm,
    selectedSpecialization,
    setSelectedSpecialization,
    selectedAccent,
    setSelectedAccent,
    clearFilters,
  } = useTeacherFilters(teachers);

  console.log('Filtered teachers:', filteredTeachers);
  console.log('Total teachers:', teachers.length);

  useEffect(() => {
    console.log('Fetching teachers...');
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      console.log('Setting mock teachers data...');
      setTeachers(mockTeachers);
      console.log('Mock teachers set:', mockTeachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookTeacher = (teacherId: string) => {
    console.log('Booking teacher:', teacherId);
    toast({
      title: "Booking Feature",
      description: "Teacher booking will be available soon!",
    });
  };

  const handleWatchIntro = (videoUrl: string) => {
    console.log('Watch intro clicked for video:', videoUrl);
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      toast({
        title: "Video Unavailable",
        description: "This teacher hasn't uploaded an intro video yet.",
      });
    }
  };

  if (loading) {
    console.log('Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading teachers...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main teacher discovery content');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect English Teacher
          </h1>
          <p className="text-gray-600 mb-6">
            Browse our qualified teachers and book your next lesson
          </p>

          <TeacherSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            selectedAccent={selectedAccent}
            setSelectedAccent={setSelectedAccent}
            teachers={teachers}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onWatchIntro={handleWatchIntro}
              onBookTeacher={handleBookTeacher}
            />
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No teachers found matching your criteria</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDiscovery;
