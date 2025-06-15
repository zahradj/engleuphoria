
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
  
  const isTeacher = currentUser.role === 'teacher';
  const studentLevel = Math.floor(studentXP / 100);

  const tabs = [
    { id: "chat", label: "Chat", icon: MessageCircle, color: "text-blue-600" },
    { id: "homework", label: "Tasks", icon: BookOpen, color: "text-green-600" },
    { id: "dictionary", label: "Dictionary", icon: Book, color: "text-purple-600" }
  ];

  // Enhanced mock chat messages
  const chatMessages = [
    { id: 1, sender: 'Teacher Sarah', message: 'Great job on the pronunciation exercise! 🎉', time: '10:30', isTeacher: true, avatar: 'T' },
    { id: 2, sender: 'Emma', message: 'Thank you! Can we practice more words?', time: '10:31', isTeacher: false, avatar: 'E' },
    { id: 3, sender: 'Teacher Sarah', message: 'Of course! Let\'s try some new vocabulary. 📚', time: '10:32', isTeacher: true, avatar: 'T' }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle message sending logic here
      setNewMessage("");
    }
  };

  return (
    <Card className="h-full shadow-xl flex flex-col overflow-hidden bg-white/90 backdrop-blur-sm border-0 rounded-2xl">
      {/* Enhanced Student Video Profile */}
      <div className="p-4 border-b bg-gradient-to-br from-green-50 to-blue-50 flex-shrink-0">
        <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden mb-3 group">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-blue-200/30 animate-pulse"></div>
          
          <div className="text-center relative z-10">
            <div className="relative mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <span className="text-lg font-bold text-white">E</span>
              </div>
              {/* Online status ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-80 animate-pulse"></div>
            </div>
            <p className="font-semibold text-gray-800 text-sm">Emma (Student)</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className="bg-gradient-to-r from-green-400 to-cyan-500 text-white border-0 shadow-md">
            Level {studentLevel}
          </Badge>
          <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white border-0 shadow-md">
            Online
          </Badge>
        </div>
      </div>

      {/* Enhanced Tabs Navigation */}
      <div className="border-b p-3 flex-shrink-0 bg-gray-50/50">
        <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeRightTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`text-xs px-4 py-2 flex items-center gap-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105' 
                    : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                }`}
              >
                <IconComponent size={14} className={isActive ? 'text-white' : tab.color} />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeRightTab === "chat" && (
          <div className="h-full flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${
                      msg.isTeacher ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Enhanced Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                      msg.isTeacher 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600' 
                        : 'bg-gradient-to-br from-green-500 to-cyan-600'
                    }`}>
                      {msg.avatar}
                    </div>
                    
                    {/* Enhanced Message Bubble */}
                    <div className={`flex flex-col max-w-[70%] ${
                      msg.isTeacher ? "items-start" : "items-end"
                    }`}>
                      <div
                        className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:scale-105 ${
                          msg.isTeacher
                            ? "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
                            : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span className={`font-medium ${msg.isTeacher ? "text-purple-600" : "text-blue-600"}`}>
                          {msg.sender}
                        </span>
                        <span className="mx-2">•</span>
                        <span>{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Enhanced Message Input */}
            <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="flex gap-3">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-400 transition-colors"
                />
                <Button 
                  size="sm" 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeRightTab === "homework" && (
          <div className="p-4 space-y-4">
            {/* Enhanced Today's Tasks */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                Today's Tasks
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 p-2 rounded-lg bg-white/60">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-700 line-through">Complete vocabulary exercise</span>
                  <Badge variant="secondary" className="ml-auto text-xs">Done</Badge>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg bg-white/60">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">Practice pronunciation</span>
                  <Badge className="ml-auto text-xs bg-yellow-500">In Progress</Badge>
                </li>
                <li className="flex items-center gap-3 p-2 rounded-lg bg-white/60">
                  <div className="w-3 h-3 bg-gray-300 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-500">Read short story</span>
                  <Badge variant="outline" className="ml-auto text-xs">Pending</Badge>
                </li>
              </ul>
            </div>

            {/* Enhanced Weekly Goals */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Weekly Goals
              </h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                Focus on past tense verbs and daily conversation practice. 
                Aim to complete 3 speaking exercises this week.
              </p>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex justify-between items-center text-xs text-blue-600 mb-1">
                  <span>Weekly Progress</span>
                  <span>5/7 days</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRightTab === "dictionary" && (
          <div className="p-4 space-y-4">
            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input 
                placeholder="Search for a word..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm border-2 border-gray-200 rounded-xl focus:border-purple-400 transition-colors" 
              />
            </div>
            
            {/* Enhanced Recent Words */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 shadow-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Book className="text-purple-600" size={16} />
                Recent Words
              </h4>
              <div className="space-y-3">
                {[
                  { word: 'beautiful', type: 'adjective', definition: 'pleasing to look at' },
                  { word: 'quickly', type: 'adverb', definition: 'at a fast speed' },
                  { word: 'exciting', type: 'adjective', definition: 'causing enthusiasm' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/70 rounded-lg hover:bg-white transition-colors group">
                    <div>
                      <span className="font-medium text-gray-800">{item.word}</span>
                      <p className="text-xs text-gray-600 mt-1">{item.definition}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-purple-100 text-purple-700 group-hover:bg-purple-200 transition-colors"
                    >
                      {item.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Dictionary Stats */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 shadow-lg border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-3">Vocabulary Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/70 rounded-lg">
                  <div className="text-lg font-bold text-indigo-600">124</div>
                  <div className="text-xs text-gray-600">Words Learned</div>
                </div>
                <div className="text-center p-3 bg-white/70 rounded-lg">
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
