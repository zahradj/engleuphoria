
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Timer, 
  Star, 
  Award, 
  Upload, 
  Gamepad2, 
  BookOpen, 
  MessageCircle,
  Target,
  Clock,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickTeachingToolsProps {
  currentUser?: {
    role: 'teacher' | 'student';
    name: string;
  };
}

export function QuickTeachingTools({ 
  currentUser = { role: 'teacher', name: 'Teacher' }
}: QuickTeachingToolsProps) {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} activated`,
      description: `${action} tool is now ready to use`,
    });
  };

  const quickTools = [
    {
      name: "Start Timer",
      icon: Timer,
      color: "bg-blue-500 hover:bg-blue-600",
      shortcut: "T",
      action: () => handleQuickAction("Timer")
    },
    {
      name: "Award Star",
      icon: Star,
      color: "bg-yellow-500 hover:bg-yellow-600",
      shortcut: "S",
      action: () => handleQuickAction("Star Award")
    },
    {
      name: "Show Rewards",
      icon: Award,
      color: "bg-purple-500 hover:bg-purple-600",
      shortcut: "R",
      action: () => handleQuickAction("Rewards Panel")
    },
    {
      name: "Upload Material",
      icon: Upload,
      color: "bg-green-500 hover:bg-green-600",
      shortcut: "U",
      action: () => handleQuickAction("Material Upload")
    },
    {
      name: "Quick Games",
      icon: Gamepad2,
      color: "bg-orange-500 hover:bg-orange-600",
      shortcut: "G",
      action: () => handleQuickAction("Games Library")
    },
    {
      name: "Homework",
      icon: BookOpen,
      color: "bg-indigo-500 hover:bg-indigo-600",
      shortcut: "H",
      action: () => handleQuickAction("Homework Assignment")
    }
  ];

  const sessionActions = [
    {
      name: "Set Goal",
      icon: Target,
      description: "Set lesson objective"
    },
    {
      name: "Quick Break",
      icon: Clock,
      description: "5-minute break timer"
    },
    {
      name: "AI Assist",
      icon: Sparkles,
      description: "Get teaching suggestions"
    },
    {
      name: "Student Check",
      icon: MessageCircle,
      description: "Quick comprehension check"
    }
  ];

  return (
    <div className="space-y-3">
      {/* Quick Action Tools */}
      <Card className="p-3">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles size={14} />
            Quick Tools
            <Badge variant="secondary" className="text-xs ml-auto">
              Teacher
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-2">
            {quickTools.map((tool, index) => (
              <Button
                key={index}
                size="sm"
                className={`${tool.color} text-white text-xs h-8 relative group`}
                onClick={tool.action}
              >
                <tool.icon size={12} className="mr-1" />
                <span className="hidden sm:inline">{tool.name}</span>
                <span className="sm:hidden">{tool.icon.name}</span>
                <kbd className="absolute -top-1 -right-1 bg-white text-gray-800 text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {tool.shortcut}
                </kbd>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Session Actions */}
      <Card className="p-3">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target size={14} />
            Session Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-2">
          {sessionActions.map((action, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleQuickAction(action.name)}
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <action.icon size={10} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium">{action.name}</div>
                <div className="text-xs text-gray-500">{action.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
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

      {/* Quick Notes */}
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
    </div>
  );
}
