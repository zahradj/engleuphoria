
import React from "react";
import { Card } from "@/components/ui/card";
import { Target, CheckCircle } from "lucide-react";

interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface TodaysGoalsCardProps {
  goals: Goal[];
  onGoalToggle: (goalId: string) => void;
}

export function TodaysGoalsCard({ goals, onGoalToggle }: TodaysGoalsCardProps) {
  return (
    <Card className="p-4 bg-white shadow-sm border border-gray-200 flex-1 min-h-0">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-green-500 w-5 h-5" />
        <h3 className="font-semibold text-gray-900">Today's Goals</h3>
      </div>
      
      <div className="space-y-3 overflow-y-auto">
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center gap-3">
            <button
              onClick={() => onGoalToggle(goal.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                goal.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {goal.completed && <CheckCircle size={12} />}
            </button>
            <span className={`text-sm flex-1 ${
              goal.completed ? 'line-through text-gray-500' : 'text-gray-700'
            }`}>
              {goal.text}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
