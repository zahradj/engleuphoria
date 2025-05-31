
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageSquare, Send, Star } from "lucide-react";

interface TeacherMessagesSectionProps {
  handlers: any;
}

export const TeacherMessagesSection = ({ handlers }: TeacherMessagesSectionProps) => {
  const messages = [
    {
      id: 1,
      from: "Sarah (Julia's mom)",
      subject: "Question about homework",
      preview: "Hi, I wanted to ask about the reading assignment...",
      time: "2 hours ago",
      unread: true,
      type: "parent"
    },
    {
      id: 2,
      from: "Admin Team",
      subject: "New curriculum update",
      preview: "We've updated the Magic Academy curriculum...",
      time: "1 day ago",
      unread: false,
      type: "admin"
    },
    {
      id: 3,
      from: "Mike (Alex's dad)",
      subject: "Scheduling question",
      preview: "Could we reschedule next week's lesson?",
      time: "2 days ago",
      unread: true,
      type: "parent"
    },
    {
      id: 4,
      from: "Platform Support",
      subject: "Weekly performance report",
      preview: "Your teaching performance summary for this week...",
      time: "3 days ago",
      unread: false,
      type: "system"
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "New teaching materials available",
      content: "We've added new interactive worksheets for Level 2 students.",
      date: "May 22, 2025"
    },
    {
      id: 2,
      title: "Platform maintenance scheduled",
      content: "Scheduled maintenance on Sunday from 2-4 AM EST.",
      date: "May 20, 2025"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages & Communications</h2>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search messages..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      message.unread ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {message.from.split(' ')[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${message.unread ? 'text-blue-600' : ''}`}>
                              {message.from}
                            </span>
                            <Badge variant={
                              message.type === 'parent' ? 'default' : 
                              message.type === 'admin' ? 'secondary' : 'outline'
                            }>
                              {message.type}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <div className={`font-medium mt-1 ${message.unread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {message.subject}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 truncate">
                          {message.preview}
                        </div>
                      </div>
                      {message.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Message Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Unread</span>
                  <Badge variant="destructive">3</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This week</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response rate</span>
                  <span className="text-green-600 font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg. response time</span>
                  <span className="font-medium">2.5 hrs</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Announcements */}
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-sm">{announcement.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{announcement.content}</div>
                    <div className="text-xs text-gray-500 mt-2">{announcement.date}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Julia's mom</span>
                  </div>
                  <p className="text-sm text-gray-700">"Excellent lesson! Julia loved the interactive activities."</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">Alex's dad</span>
                  </div>
                  <p className="text-sm text-gray-700">"Great progress in speaking confidence. Thank you!"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
