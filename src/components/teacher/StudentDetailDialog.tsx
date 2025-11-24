import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { StudentLessonHistory } from './StudentLessonHistory';
import { BookOpen, Trophy, Target, Clock } from 'lucide-react';

interface StudentDetailDialogProps {
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  studentLevel?: string;
  onClose: () => void;
}

export function StudentDetailDialog({
  studentId,
  studentName,
  studentAvatar,
  studentLevel = 'A1',
  onClose,
}: StudentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('lessons');

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={studentAvatar} />
              <AvatarFallback className="text-lg">
                {studentName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{studentName}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{studentLevel}</Badge>
                <span className="text-sm text-muted-foreground">Student Progress Overview</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lessons">Lesson Progress</TabsTrigger>
            <TabsTrigger value="stats">Overall Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons" className="mt-6">
            <StudentLessonHistory studentId={studentId} />
          </TabsContent>

          <TabsContent value="stats" className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Lessons Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">2,450</p>
                      <p className="text-sm text-muted-foreground">Total XP Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">87%</p>
                      <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">8.5h</p>
                      <p className="text-sm text-muted-foreground">Total Study Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-medium">Completed: Family Members</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                      +200 XP
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <div>
                      <p className="font-medium">Started: Daily Routines</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Redo Required: Colors & Shapes</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-700 border-orange-500/20">
                      Needs Review
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
