
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen, Book, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedRightPanelProps {
  studentXP: number;
  activeRightTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  enhancedClassroom: any;
}

export function UnifiedRightPanel({
  studentXP,
  activeRightTab,
  onTabChange,
  currentUser,
  enhancedClassroom
}: UnifiedRightPanelProps) {
  const isTeacher = currentUser.role === 'teacher';
  const studentLevel = Math.floor(studentXP / 100);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "homework", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  // Mock chat messages
  const chatMessages = [
    { id: 1, sender: 'Teacher Sarah', message: 'Great job on the pronunciation exercise!', time: '10:30', isTeacher: true },
    { id: 2, sender: 'Emma', message: 'Thank you! Can we practice more words?', time: '10:31', isTeacher: false },
    { id: 3, sender: 'Teacher Sarah', message: 'Of course! Let\'s try some new vocabulary.', time: '10:32', isTeacher: true }
  ];

  return (
    <Card className="h-full shadow-lg flex flex-col overflow-hidden bg-white">
      {/* Student Video - Clean and Simple */}
      <div className="p-4 border-b bg-gray-50 flex-shrink-0">
        <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center relative overflow-hidden mb-3">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <p className="font-medium text-gray-700 text-sm">Emma (Student)</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="bg-green-100 text-green-700">Level {studentLevel}</Badge>
          <Badge className="bg-blue-100 text-blue-700">Online</Badge>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b p-3 flex-shrink-0">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeRightTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`text-xs px-3 py-2 flex items-center gap-2 ${
                  activeRightTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <IconComponent size={14} />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeRightTab === "chat" && (
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-3">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.isTeacher ? "items-start" : "items-end"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-[85%] ${
                        msg.isTeacher
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span className={msg.isTeacher ? "text-green-600" : "text-blue-600"}>
                        {msg.sender}
                      </span>
                      <span className="mx-1">•</span>
                      <span>{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t bg-gray-50 flex gap-2">
              <Input
                placeholder="Type a message..."
                className="flex-1 text-sm"
              />
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Send size={14} />
              </Button>
            </div>
          </div>
        )}

        {activeRightTab === "homework" && (
          <div className="p-4 space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-medium text-yellow-800 mb-1">Today's Tasks</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Complete vocabulary exercise
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Practice pronunciation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  Read short story
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-1">Weekly Goals</h4>
              <p className="text-sm text-blue-700">
                Focus on past tense verbs and daily conversation practice.
              </p>
            </div>
          </div>
        )}

        {activeRightTab === "dictionary" && (
          <div className="p-4">
            <div className="space-y-3">
              <Input placeholder="Search for a word..." className="text-sm" />
              
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-2">Recent Words</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>beautiful</span>
                    <Badge variant="secondary" className="text-xs">adjective</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>quickly</span>
                    <Badge variant="secondary" className="text-xs">adverb</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>exciting</span>
                    <Badge variant="secondary" className="text-xs">adjective</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
