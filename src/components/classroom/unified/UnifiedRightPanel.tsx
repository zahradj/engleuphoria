import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  BookOpen, 
  Users, 
  Trophy,
  Star,
  Target,
  Book
} from "lucide-react";
import { OneOnOneChat } from "../oneonone/OneOnOneChat";
import { OneOnOneHomework } from "../oneonone/OneOnOneHomework";
import { EnhancedDictionary } from "../oneonone/dictionary/EnhancedDictionary";

interface UnifiedRightPanelProps {
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUser: any;
  enhancedClassroom: any;
}

export function UnifiedRightPanel({
  studentXP,
  activeRightTab,
  onTabChange,
  currentUser,
  enhancedClassroom
}: UnifiedRightPanelProps) {
  const { participants } = enhancedClassroom;
  const isTeacher = currentUser.role === 'teacher';

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "participants", label: "People", icon: Users },
    { id: "homework", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  const handleAddToVocab = (word: string, definition: string) => {
    console.log('Adding to vocabulary:', word, definition);
  };

  return (
    <Card className="h-full shadow-lg flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b p-3">
        <div className="grid grid-cols-2 gap-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeRightTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 h-12 text-xs"
              >
                <IconComponent size={16} />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {activeRightTab === "chat" && <OneOnOneChat />}
            
            {activeRightTab === "participants" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Participants ({participants.length + 1})</h3>
                
                {/* Current User */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">
                      {isTeacher ? 'Teacher' : 'Student'} • You
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Host</Badge>
                </div>

                {/* Other Participants */}
                {participants.map((participant, index) => (
                  <div key={participant.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {participant.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{participant.name || 'Unknown User'}</p>
                      <p className="text-xs text-gray-500">Participant</p>
                    </div>
                  </div>
                ))}

                {participants.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Waiting for others to join...</p>
                  </div>
                )}
              </div>
            )}
            
            {activeRightTab === "homework" && <OneOnOneHomework />}
            
            {activeRightTab === "dictionary" && (
              <EnhancedDictionary onAddToVocab={handleAddToVocab} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* XP Progress Footer */}
      <div className="border-t p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <Badge className="bg-yellow-100 text-yellow-700">
            Level {Math.floor(studentXP / 100)}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>XP: {studentXP % 100}/100</span>
            <span>Total: {studentXP}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${(studentXP % 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-white/50 rounded p-2">
            <Star size={12} className="mx-auto text-yellow-500 mb-1" />
            <p className="text-xs font-medium">{Math.floor(studentXP / 50)}</p>
            <p className="text-xs text-gray-500">Stars</p>
          </div>
          <div className="bg-white/50 rounded p-2">
            <Target size={12} className="mx-auto text-green-500 mb-1" />
            <p className="text-xs font-medium">{Math.floor(studentXP / 25)}</p>
            <p className="text-xs text-gray-500">Goals</p>
          </div>
          <div className="bg-white/50 rounded p-2">
            <Trophy size={12} className="mx-auto text-purple-500 mb-1" />
            <p className="text-xs font-medium">{Math.floor(studentXP / 100)}</p>
            <p className="text-xs text-gray-500">Levels</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
