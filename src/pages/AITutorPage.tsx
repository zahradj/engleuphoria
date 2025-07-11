import React from 'react';
import { MobileAwarePage } from '@/components/mobile/MobileAwarePage';

export const AITutorPage: React.FC = () => {
  return (
    <MobileAwarePage title="AI Tutor">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">AI Tutor</h1>
          <p className="text-muted-foreground">
            Your personal AI English tutor is coming soon! 
            Practice conversations, get instant feedback, and improve your English skills.
          </p>
        </div>
      </div>
    </MobileAwarePage>
  );
};

export default AITutorPage;