
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-states";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { SystemId } from "@/types/multiTenant";
import { DashboardRouter } from "@/components/student/dashboards/DashboardRouter";
import { ScrollHeader } from "@/components/navigation/ScrollHeader";

// Lazy load components to improve initial load time
import { MinimalStudentHeader } from "@/components/student/MinimalStudentHeader";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { LearningPathTab } from "@/components/student/LearningPathTab";
import { TeachersTab } from "@/components/student/TeachersTab";
import { UpcomingClassesTab } from "@/components/student/UpcomingClassesTab";
import { SpeakingPracticeTab } from "@/components/student/speaking/SpeakingPracticeTab";
import { EnhancedBillingTab } from "@/components/student/EnhancedBillingTab";
import { ProfileTab } from "@/components/student/ProfileTab";
import { SettingsTab } from "@/components/student/SettingsTab";
import { QuickActions } from "@/components/navigation/QuickActions";
import { AssessmentsTab } from "@/components/student/tabs/AssessmentsTab";
import { CertificatesTab } from "@/components/student/tabs/CertificatesTab";


const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hasProfile, setHasProfile] = useState(false);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [systemId, setSystemId] = useState<SystemId>('kids');
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
        
        // Fetch user's current_system from database
        if (user?.id) {
          const { data: userData, error } = await supabase
            .from('users')
            .select('current_system')
            .eq('id', user.id)
            .single();
          
          if (!error && userData?.current_system) {
            // Map database value to SystemId
            const systemMap: Record<string, SystemId> = {
              'KIDS': 'kids',
              'TEENS': 'teen',
              'ADULTS': 'adult',
              'kids': 'kids',
              'teen': 'teen',
              'adult': 'adult'
            };
            setSystemId(systemMap[userData.current_system] || 'kids');
          }
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
  }, [authLoading, toast, user?.id]);

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
      dashboard: () => <DashboardRouter systemId={systemId} studentName={studentName} />,
      "learning-path": () => <LearningPathTab />,
      lessons: () => <LearningPathTab />,
      assessments: () => <AssessmentsTab />,
      certificates: () => <CertificatesTab />,
      teachers: () => <TeachersTab />,
      "upcoming-classes": () => <UpcomingClassesTab />,
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
      <SidebarProvider defaultOpen={true}>
        <ScrollHeader />
        <div className="flex min-h-screen w-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-7xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                  <SidebarTrigger className="lg:hidden bg-white/90 backdrop-blur-sm hover:bg-white shadow-md rounded-xl p-3 border-2 border-purple-200" />
                </div>
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
