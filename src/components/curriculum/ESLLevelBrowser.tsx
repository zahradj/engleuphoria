
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { ESLLevel } from "@/types/eslCurriculum";
import { BookOpen, Filter } from "lucide-react";
import { LevelCard } from "./components/LevelCard";
import { LevelDetails } from "./components/LevelDetails";

interface ESLLevelBrowserProps {
  refreshTrigger: number;
}

export function ESLLevelBrowser({ refreshTrigger }: ESLLevelBrowserProps) {
  const [levels, setLevels] = useState<ESLLevel[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<ESLLevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ESLLevel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");
  const [ageGroupFilter, setAgeGroupFilter] = useState("all");

  useEffect(() => {
    const allLevels = eslCurriculumService.getAllLevels();
    setLevels(allLevels);
    setFilteredLevels(allLevels);
  }, [refreshTrigger]);

  useEffect(() => {
    let filtered = levels;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(level => 
        level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.cefrLevel.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply CEFR level filter
    if (levelFilter !== "all") {
      filtered = filtered.filter(level => level.cefrLevel === levelFilter);
    }

    // Apply age group filter
    if (ageGroupFilter !== "all") {
      filtered = filtered.filter(level => level.ageGroup.includes(ageGroupFilter));
    }

    setFilteredLevels(filtered);
  }, [levels, searchQuery, levelFilter, ageGroupFilter]);

  return (
    <div className="space-y-6">
      {/* Enhanced CEFR Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Enhanced 8-Level ESL Curriculum Framework
          </CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive age-appropriate curriculum from Pre-A1 (Starter) to C1 (Fluent/Proficient)
          </p>
        </CardHeader>
        <CardContent>
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search levels by name, description, or CEFR level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="CEFR Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Pre-A1">Pre-A1</SelectItem>
                  <SelectItem value="A1">A1</SelectItem>
                  <SelectItem value="A1+">A1+</SelectItem>
                  <SelectItem value="A2">A2</SelectItem>
                  <SelectItem value="A2+">A2+</SelectItem>
                  <SelectItem value="B1">B1</SelectItem>
                  <SelectItem value="B1+">B1+</SelectItem>
                  <SelectItem value="B2">B2</SelectItem>
                  <SelectItem value="B2+">B2+</SelectItem>
                  <SelectItem value="C1">C1</SelectItem>
                  <SelectItem value="C1+">C1+</SelectItem>
                  <SelectItem value="C2">C2</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Age Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="4-7">4-7 years</SelectItem>
                  <SelectItem value="6-9">6-9 years</SelectItem>
                  <SelectItem value="8-11">8-11 years</SelectItem>
                  <SelectItem value="10-13">10-13 years</SelectItem>
                  <SelectItem value="12-15">12-15 years</SelectItem>
                  <SelectItem value="14-17">14-17 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLevels.map((level) => (
              <LevelCard 
                key={level.id} 
                level={level}
                isSelected={selectedLevel?.id === level.id}
                onSelect={setSelectedLevel}
              />
            ))}
          </div>
          
          {filteredLevels.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No levels found matching your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Selected Level Details */}
      {selectedLevel && (
        <LevelDetails level={selectedLevel} />
      )}
    </div>
  );
}
