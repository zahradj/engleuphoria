import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Baby, GraduationCap, BookOpen } from 'lucide-react';

interface AgeGroupTabsProps {
  selectedAgeGroup: string;
  onAgeGroupChange: (ageGroup: string) => void;
}

const ageGroups = [
  { value: '5-7', label: 'Ages 5-7', icon: Baby },
  { value: '8-10', label: 'Ages 8-10', icon: BookOpen },
  { value: '11+', label: 'Ages 11+', icon: GraduationCap },
];

export const AgeGroupTabs: React.FC<AgeGroupTabsProps> = ({
  selectedAgeGroup,
  onAgeGroupChange,
}) => {
  return (
    <Tabs value={selectedAgeGroup} onValueChange={onAgeGroupChange}>
      <TabsList className="grid w-full grid-cols-3">
        {ageGroups.map((group) => {
          const Icon = group.icon;
          return (
            <TabsTrigger 
              key={group.value} 
              value={group.value}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{group.label}</span>
              <span className="sm:hidden">{group.value}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};
