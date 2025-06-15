
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Clock, Sparkles, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SessionActions() {
  const { toast } = useToast();

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} activated`,
      description: `${action} tool is now ready to use`,
    });
  };

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
  );
}
