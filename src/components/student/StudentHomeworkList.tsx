
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload } from "lucide-react";

interface HomeworkItem {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  points: number;
}

interface StudentHomeworkListProps {
  homework: HomeworkItem[];
}

export const StudentHomeworkList = ({ homework }: StudentHomeworkListProps) => {
  return (
    <Card className="border-2 border-orange-200 shadow-xl">
      <CardHeader className="border-b border-orange-100">
        <CardTitle className="flex items-center gap-3 text-orange-800">
          <div className="bg-orange-500 p-3 rounded-2xl">
            <FileText className="h-6 w-6 text-white" />
          </div>
          Assignments & Homework
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {homework.map((hw) => (
            <div key={hw.id} className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${hw.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{hw.title}</h4>
                  <p className="text-sm text-gray-600">Due: {hw.dueDate}</p>
                  <p className="text-xs text-purple-600 font-bold">Worth {hw.points} points</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={hw.status === 'completed' ? 'default' : 'destructive'} className="px-3 py-1">
                  {hw.status}
                </Badge>
                {hw.status === 'pending' && (
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <Upload className="h-4 w-4 mr-1" />
                    Submit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
