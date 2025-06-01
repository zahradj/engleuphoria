
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { StudentQuickActions } from "./StudentQuickActions";
import { StudentUpcomingClasses } from "./StudentUpcomingClasses";
import { AchievementsBoard } from "@/components/gamification/AchievementsBoard";

interface StudentOverviewTabProps {
  upcomingClasses: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    teacher: string;
    color: string;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    level: "bronze" | "silver" | "gold";
    unlocked: boolean;
    progress?: { current: number; total: number };
    pointsAwarded: number;
  }>;
}

export const StudentOverviewTab = ({ upcomingClasses, achievements }: StudentOverviewTabProps) => {
  return (
    <div className="space-y-8">
      <StudentQuickActions />
      <StudentUpcomingClasses classes={upcomingClasses} />
      
      {/* Enhanced Achievements Preview */}
      <Card className="border-2 border-yellow-200 shadow-xl bg-gradient-to-br from-white to-yellow-50">
        <CardHeader className="border-b border-yellow-100">
          <CardTitle className="flex items-center gap-3 text-yellow-800">
            <div className="bg-yellow-500 p-3 rounded-2xl">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AchievementsBoard achievements={achievements} />
          <div className="mt-6 p-4 bg-purple-100 rounded-xl border-2 border-purple-300">
            <p className="text-purple-800 font-bold text-center">🌟 Next Achievement: Grammar Master</p>
            <p className="text-purple-700 text-sm text-center mt-1">Complete 5 more grammar exercises to unlock!</p>
            <Progress value={60} className="mt-3 h-3" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
