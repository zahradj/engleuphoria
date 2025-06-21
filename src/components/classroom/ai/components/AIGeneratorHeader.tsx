
import React from "react";
import { Zap, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIGeneratorHeaderProps {
  isDemoMode: boolean;
}

export function AIGeneratorHeader({ isDemoMode }: AIGeneratorHeaderProps) {
  return (
    <>
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold">Fast AI Generator</h2>
          {isDemoMode && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Demo Mode
            </Badge>
          )}
        </div>
      </div>

      {isDemoMode && (
        <div className="p-4 pb-0">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Demo Mode Active</p>
                <p>Fast mock generation enabled. Connect to Supabase for AI-powered content.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
