import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClassroomLayout } from "@/components/classroom/ClassroomLayout";
import { Whiteboard } from "@/components/classroom/Whiteboard";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  LucideIcon,
  MessageSquare,
  Pencil,
  Plus,
   presentation,
} from "lucide-react";

// Define types for layout options
type LayoutType = "gallery" | "spotlight" | "sidebar";

const ESLClassroom = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [layout, setLayout] = useState<LayoutType>("gallery");
  const [layoutChangeMessage, setLayoutChangeMessage] = useState<string>("");
  const [showLayoutToast, setShowLayoutToast] = useState<boolean>(false);
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  useEffect(() => {
    // In a real app, we'd fetch this from an API
    const storedName = localStorage.getItem("studentName");
    const storedPoints = localStorage.getItem("points");

    if (!storedName) {
      navigate("/");
      return;
    }

    setStudentName(storedName);
    setPoints(storedPoints ? parseInt(storedPoints) : 0);
  }, [navigate]);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    setLayoutChangeMessage(`${languageText.switchedTo} ${newLayout} ${languageText.view}`);
    setShowLayoutToast(true);
    
    setTimeout(() => {
      setShowLayoutToast(false);
    }, 3000);
  };

  const mainContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{languageText.lessonContent}</CardTitle>
        </CardHeader>
        <CardContent>
          <AspectRatio ratio={16 / 9}>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Lesson Video"
              allowFullScreen
            />
          </AspectRatio>
          <p className="mt-4">{languageText.clickToPlayVideo}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{languageText.lessonMaterial}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p>Worksheet - Animals and their Habitats.pdf</p>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {languageText.download}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{languageText.chat}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">shadcn</p>
                <p className="text-sm text-muted-foreground">
                  {languageText.typeMessage}
                </p>
              </div>
            </div>
            <Input type="text" placeholder={languageText.message} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const sidebarContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{languageText.students}</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="text" placeholder={languageText.searchStudents} />
          <ul className="mt-4 space-y-2">
            <li>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">shadcn</p>
                </div>
                <Badge variant="secondary">{languageText.online}</Badge>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/sadmann7.png" />
                    <AvatarFallback>M</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">M</p>
                </div>
                <Badge variant="secondary">{languageText.speakingNow}</Badge>
              </div>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/emilkowalski.png" />
                    <AvatarFallback>EK</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">Emil Kowalski</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {languageText.lastActive} 2m
                </p>
              </div>
            </li>
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
              <a href="#" className="text-sm hover:underline">
                Lesson Plan - Animals.pdf
              </a>
            </li>
            <li>
              <a href="#" className="text-sm hover:underline">
                Vocabulary List - Unit 3.docx
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <ClassroomLayout
      studentName={studentName}
      points={points}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
};

export default ESLClassroom;
