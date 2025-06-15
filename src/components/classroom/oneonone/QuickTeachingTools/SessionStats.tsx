
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function SessionStats() {
  return (
    <Card className="p-3">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Clock size={14} />
          Session Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-blue-50 rounded-lg">
            <div className="text-sm font-bold text-blue-600">18m</div>
            <div className="text-xs text-gray-600">Time Elapsed</div>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <div className="text-sm font-bold text-green-600">4</div>
            <div className="text-xs text-gray-600">Stars Awarded</div>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <div className="text-sm font-bold text-purple-600">85%</div>
            <div className="text-xs text-gray-600">Engagement</div>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg">
            <div className="text-sm font-bold text-orange-600">2</div>
            <div className="text-xs text-gray-600">Activities Done</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
