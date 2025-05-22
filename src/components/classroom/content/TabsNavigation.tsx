
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface TabsNavigationProps {
  isTeacherView: boolean;
}

export function TabsNavigation({ isTeacherView }: TabsNavigationProps) {
  const { languageText } = useLanguage();
  
  return (
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="video">{languageText.videoAndSlides}</TabsTrigger>
      <TabsTrigger value="whiteboard">{languageText.whiteboard}</TabsTrigger>
      <TabsTrigger value="students">{isTeacherView ? languageText.students : languageText.lessons}</TabsTrigger>
    </TabsList>
  );
}
