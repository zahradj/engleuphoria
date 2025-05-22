
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus } from "lucide-react";
import { ClassroomChat } from "@/components/classroom/ClassroomChat";
import { useLanguage } from "@/contexts/LanguageContext";

interface Student {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isCurrentUser: boolean;
}

interface SidebarContentProps {
  studentName: string;
  isChatOpen: boolean;
  students: Student[];
  isTeacherView: boolean;
  toggleChat: () => void;
}

export function SidebarContent({
  studentName,
  isChatOpen,
  students,
  isTeacherView,
  toggleChat,
}: SidebarContentProps) {
  const { languageText } = useLanguage();
  
  if (isChatOpen) {
    return (
      <div className="space-y-4">
        <ClassroomChat
          teacherName="Ms. Johnson"
          studentName={studentName}
        />
        <Button variant="outline" onClick={toggleChat} className="w-full">
          {languageText.closeChat}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{languageText.students}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="text" placeholder={languageText.searchStudents} className="mb-3" />
          <ul className="space-y-3">
            {students.map((student) => (
              <li key={student.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={student.avatar} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {student.name}
                        {student.isCurrentUser && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({languageText.you})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {student.status === "speaking" && languageText.speaking}
                        {student.status === "online" && languageText.online}
                        {student.status === "offline" && languageText.lastActive} 5m
                      </p>
                    </div>
                  </div>
                  {student.status !== "offline" && (
                    <Badge variant={student.status === "speaking" ? "default" : "secondary"}>
                      {student.status === "speaking" ? languageText.speakingNow : languageText.online}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{languageText.resources}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm hover:underline flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Animal Vocabulary.pdf
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:underline flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Animal Sounds.mp3
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:underline flex items-center">
                <Download className="mr-2 h-4 w-4" />
                Homework Assignment.docx
              </a>
            </li>
          </ul>
          
          {isTeacherView && (
            <Button variant="outline" size="sm" className="mt-3 w-full">
              <Plus className="mr-1 h-4 w-4" />
              Add Resource
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
