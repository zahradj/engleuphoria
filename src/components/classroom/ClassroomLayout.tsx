
import React from "react";
import { ClassroomHeader } from "./ClassroomHeader";
// Removed broken StudentHeader import

interface ClassroomLayoutProps {
  children: React.ReactNode;
  studentName: string;
  points: number;
  isTeacherView: boolean;
}

export const ClassroomLayout = ({ children, studentName, points, isTeacherView }: ClassroomLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ClassroomHeader 
        studentName={studentName} 
        points={points} 
        isTeacherView={isTeacherView}
      />
      {children}
    </div>
  );
};
