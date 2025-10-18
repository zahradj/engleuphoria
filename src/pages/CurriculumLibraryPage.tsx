
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ESLCurriculumManager } from "@/components/curriculum/ESLCurriculumManager";
import { useAuth } from "@/contexts/AuthContext";

const CurriculumLibraryPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // SECURITY: Use server-validated role from AuthContext
    if (loading) return;
    
    if (!user) {
      navigate("/login");
      return;
    }

    // Set display name from user data
    setUserName(user.email?.split('@')[0] || "User");
  }, [user, loading, navigate]);

  const getDashboardRoute = () => {
    if (!user) return "/login";
    
    switch (user.role) {
      case "student":
        return "/student";
      case "teacher":
        return "/teacher";
      case "admin":
        return "/admin";
      default:
        return "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(getDashboardRoute())}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">ESL Curriculum Library</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">Welcome back, {userName}!</div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ESLCurriculumManager />
      </div>
    </div>
  );
};

export default CurriculumLibraryPage;
