import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const StudentsPlaceholder = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="max-w-md w-full">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Student Management
          </h3>
          <p className="text-muted-foreground">
            Coming soon. You'll be able to manage your students, track their progress, and communicate with them here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
