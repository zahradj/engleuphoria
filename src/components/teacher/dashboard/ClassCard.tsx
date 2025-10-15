
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

interface ClassCardProps {
  title: string;
  time: string;
  students: number;
  buttonText: string;
  onButtonClick: () => void;
}

export const ClassCard = ({ title, time, students, buttonText, onButtonClick }: ClassCardProps) => (
  <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md hover:shadow-lg transition-all">
    <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/50 dark:via-pink-900/50 dark:to-blue-900/50 p-4 border-b border-purple-200/50">
      <h3 className="font-semibold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">📚 {title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <Clock className="h-4 w-4 text-purple-500" />
        <p className="text-sm text-purple-600 dark:text-purple-400">⏰ {time}</p>
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          <p className="text-sm text-purple-700 dark:text-purple-300">👥 {students} students</p>
        </div>
      </div>
      <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md" size="sm" onClick={onButtonClick}>
        {buttonText} ✨
      </Button>
    </CardContent>
  </Card>
);
