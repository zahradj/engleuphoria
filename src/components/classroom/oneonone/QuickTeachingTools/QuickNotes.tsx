
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function QuickNotes() {
  return (
    <Card className="p-3">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageCircle size={14} />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          <div className="text-xs bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
            Student excels at past tense verbs
          </div>
          <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-400">
            Focus on pronunciation next lesson
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
