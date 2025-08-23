
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Lazy load components to improve initial load time
import { MinimalStudentHeader } from "@/components/student/MinimalStudentHeader";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { CleanStudentDashboard } from "@/components/student/CleanStudentDashboard";
import { TeachersTab } from "@/components/student/TeachersTab";
import { UpcomingClassesTab } from "@/components/student/UpcomingClassesTab";
import { HomeworkTab } from "@/components/student/HomeworkTab";
import { MaterialsLibraryTab } from "@/components/student/MaterialsLibraryTab";
import { ProgressTrackerTab } from "@/components/student/ProgressTrackerTab";
import { SpeakingPracticeTab } from "@/components/student/speaking/SpeakingPracticeTab";
import { EnhancedBillingTab } from "@/components/student/EnhancedBillingTab";
import { ProfileTab } from "@/components/student/ProfileTab";
import { SettingsTab } from "@/components/student/SettingsTab";
import { LearningPathTab } from "@/components/student/LearningPathTab";
import { QuickActions } from "@/components/navigation/QuickActions";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasProfile, setHasProfile] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading, signOut } = useAuth();
  
  // Generate or get student ID and name
  const generateStudentId = () => {
    const existingId = localStorage.getItem('studentId');
    if (existingId) return existingId;
    const newId = 'STU' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('studentId', newId);
    return newId;
  };
  
  const studentName = user?.user_metadata?.full_name || localStorage.getItem('studentName') || user?.email?.split('@')[0] || 'Student';
  const studentId = generateStudentId();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log('📊 Initializing student dashboard...');
        
        // Check if student has completed their profile
        const profile = localStorage.getItem('studentProfile');
        if (profile) {
          setStudentProfile(JSON.parse(profile));
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
        
        setIsInitialized(true);
        console.log('✅ Student dashboard initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing student dashboard:', error);
        toast({
          title: "Loading Error",
          description: "There was an issue loading your dashboard. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    // Only initialize after auth is ready
    if (!authLoading) {
      initializeDashboard();
    }
  }, [authLoading, toast]);

  const handleLogout = async () => {
    try {
      // Clear local storage first
      localStorage.removeItem('studentName');
      localStorage.removeItem('userType');
      localStorage.removeItem('studentProfile');
      localStorage.removeItem('studentId');
      
      // Call the proper signOut function from AuthContext
      await signOut();
      
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an issue logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderActiveTab = () => {
    const tabComponents = {
      dashboard: () => <CleanStudentDashboard studentName={studentName} studentProfile={studentProfile} />,
      "learning-path": () => <LearningPathTab />,
      teachers: () => <TeachersTab />,
      "upcoming-classes": () => <UpcomingClassesTab />,
      homework: () => <HomeworkTab />,
      materials: () => <MaterialsLibraryTab />,
      progress: () => <ProgressTrackerTab />,
      speaking: () => <SpeakingPracticeTab />,
      billing: () => <EnhancedBillingTab />,
      profile: () => <ProfileTab studentName={studentName} />,
      settings: () => <SettingsTab />,
    };

    const TabComponent = tabComponents[activeTab as keyof typeof tabComponents] || tabComponents.dashboard;
    
    return (
      <ErrorBoundary fallback={
        <div className="p-6 text-center">
          <p className="text-red-600 mb-4">Error loading this section</p>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Return to Dashboard
          </button>
        </div>
      }>
        <TabComponent />
      </ErrorBoundary>
    );
  };

  // Show loading state
  if (authLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" message="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full bg-background">
          <StudentSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            hasProfile={hasProfile}
            onLogout={handleLogout}
          />
          
          <div className="flex-1 flex flex-col">
            <MinimalStudentHeader 
              studentName={studentName}
              studentId={studentId}
              hasProfile={hasProfile}
              studentProfile={studentProfile}
            />
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <SidebarTrigger />
                <QuickActions />
                {renderActiveTab()}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default StudentDashboard;
