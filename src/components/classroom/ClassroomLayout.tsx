
import React from "react";

interface ClassroomLayoutProps {
  children?: React.ReactNode;
  studentName?: string;
  points?: number;
  isTeacherView?: boolean;
  mainContent?: React.ReactElement;
  sidebarContent?: React.ReactElement;
}

export const ClassroomLayout = ({ 
  children, 
  studentName, 
  points, 
  isTeacherView, 
  mainContent, 
  sidebarContent 
}: ClassroomLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {mainContent && sidebarContent ? (
        <div className="flex h-screen">
          <div className="w-1/4 bg-white border-r border-gray-200">
            {sidebarContent}
          </div>
          <div className="flex-1">
            {mainContent}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
