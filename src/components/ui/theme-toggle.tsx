import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';

export function ThemeToggle() {
  return (
    <Card className="p-4 border border-neutral-200 bg-surface shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-foreground">Theme</h3>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 rounded-lg border border-neutral-200 bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Clean Slate</p>
              <p className="text-sm text-text-muted">Soft blues and neutrals</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary-500 border border-neutral-200"></div>
              <div className="w-4 h-4 rounded-full bg-accent-500 border border-neutral-200"></div>
              <Check className="w-4 h-4 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-neutral-200 bg-surface opacity-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Coming Soon</p>
              <p className="text-sm text-text-muted">More themes in development</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-neutral-300 border border-neutral-200"></div>
              <div className="w-4 h-4 rounded-full bg-neutral-300 border border-neutral-200"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}