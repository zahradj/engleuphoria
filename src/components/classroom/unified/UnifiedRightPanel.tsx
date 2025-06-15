
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, BookOpen, Book, Send, Search } from "lucide-react";
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
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const studentLevel = Math.floor(studentXP / 100);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "homework", label: "Tasks", icon: BookOpen },
    { id: "dictionary", label: "Dictionary", icon: Book }
  ];

  const chatMessages = [
    { id: 1, sender: 'Teacher', message: 'Great job! 🎉', time: '10:30', isTeacher: true },
    { id: 2, sender: 'Emma', message: 'Thank you!', time: '10:31', isTeacher: false },
    { id: 3, sender: 'Teacher', message: 'Let\'s practice more vocabulary 📚', time: '10:32', isTeacher: true }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  return (
    <Card className="h-full shadow-xl flex flex-col overflow-hidden bg-white/90 backdrop-blur-sm border-0 rounded-xl">
      {/* Student Profile */}
      <div className="p-4 border-b bg-gradient-to-br from-green-50 to-blue-50 flex-shrink-0">
        <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center mb-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <p className="font-semibold text-gray-800 text-sm">Emma</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="bg-gradient-to-r from-green-400 to-cyan-500 text-white border-0">
            Level {studentLevel}
          </Badge>
          <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0">
            Online
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b p-3 flex-shrink-0 bg-gray-50/50">
        <div className="flex gap-1 p-1 bg-white rounded-lg shadow-sm">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeRightTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`text-xs px-3 py-2 flex items-center gap-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' 
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

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeRightTab === "chat" && (
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.isTeacher ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      msg.isTeacher 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                        : 'bg-gradient-to-br from-green-500 to-cyan-600'
                    }`}>
                      {msg.isTeacher ? 'T' : 'E'}
                    </div>
                    
                    <div className={`flex flex-col max-w-[70%] ${
                      msg.isTeacher ? "items-start" : "items-end"
                    }`}>
                      <div
                        className={`px-3 py-2 rounded-lg shadow-sm ${
                          msg.isTeacher
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t bg-gray-50">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeRightTab === "homework" && (
          <div className="p-4 space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="font-semibold text-yellow-800 mb-2">Today's Tasks</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="line-through text-gray-600">Vocabulary exercise</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Done</Badge>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Pronunciation practice</span>
                  <Badge className="ml-auto text-xs bg-yellow-500">Active</Badge>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-blue-800 mb-2">Weekly Progress</h4>
              <div className="flex justify-between items-center text-xs text-blue-600 mb-1">
                <span>5/7 days</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>
          </div>
        )}

        {activeRightTab === "dictionary" && (
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search word..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm" 
              />
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3">
              <h4 className="font-semibold text-purple-800 mb-2">Recent Words</h4>
              <div className="space-y-2">
                {[
                  { word: 'beautiful', type: 'adj', definition: 'pleasing to look at' },
                  { word: 'quickly', type: 'adv', definition: 'at a fast speed' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white/70 rounded">
                    <div>
                      <span className="font-medium text-gray-800 text-sm">{item.word}</span>
                      <p className="text-xs text-gray-600">{item.definition}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3">
              <h4 className="font-semibold text-indigo-800 mb-2">Stats</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white/70 rounded">
                  <div className="text-lg font-bold text-indigo-600">124</div>
                  <div className="text-xs text-gray-600">Total</div>
                </div>
                <div className="text-center p-2 bg-white/70 rounded">
                  <div className="text-lg font-bold text-purple-600">18</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
