import React from 'react';
import Lesson1Greetings from '@/components/lessons/Lesson1Greetings';
import { BackNavigation } from '@/components/navigation/BackNavigation';
import { NavigationBreadcrumb } from '@/components/navigation/Breadcrumb';

export default function Lesson1GreetingsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Curriculum', href: '/curriculum' },
    { label: 'Unit 0', href: '/curriculum/unit-0' },
    { label: 'Lesson 1', href: '/curriculum/unit-0/lesson-1' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <div className="mb-4">
          <BackNavigation />
          <NavigationBreadcrumb items={breadcrumbItems} />
        </div>
        <Lesson1Greetings />
      </div>
    </div>
  );
}