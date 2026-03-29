import React, { useState } from 'react';
import { ContentCreatorSidebar, ContentCreatorTab } from '@/components/content-creator/ContentCreatorSidebar';
import { CurriculumGeneratorWizard } from '@/components/content-creator/CurriculumGeneratorWizard';
import { QuizGenerator } from '@/components/content-creator/QuizGenerator';
import { CurriculumBuilder } from '@/components/admin/CurriculumBuilder';
import { CurriculumLibrary } from '@/components/admin/CurriculumLibrary';
import { NewLibrary } from '@/components/admin/NewLibrary';
import { CreatorStudio } from '@/components/content-creator/CreatorStudio';
import { AdminLessonEditor } from '@/components/admin/lesson-builder';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ContentCreatorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentCreatorTab>('creator-studio');
  const { user, signOut } = useAuth();

  // Slide builder takes full screen (no padding wrapper)
  if (activeTab === 'slide-builder') {
    return (
      <div className="flex min-h-screen bg-background">
        <ContentCreatorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-w-0">
          <AdminLessonEditor />
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'creator-studio':
        return <CreatorStudio />;
      case 'curriculum-generator':
        return <CurriculumGeneratorWizard />;
      case 'curriculum-editor':
        return <CurriculumBuilder />;
      case 'lesson-generator':
        return <NewLibrary onNavigate={(tab) => setActiveTab(tab as ContentCreatorTab)} />;
      case 'lesson-editor':
        return <CurriculumLibrary />;
      case 'quiz-generator':
        return <QuizGenerator />;
      case 'content-library':
        return <CurriculumLibrary />;
      default:
        return <CurriculumGeneratorWizard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ContentCreatorSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Welcome, <strong className="text-foreground">{user?.user_metadata?.full_name || 'Content Creator'}</strong>
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ContentCreatorDashboard;
