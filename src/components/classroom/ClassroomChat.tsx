
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { SendHorizontal, Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isTeacher: boolean;
}

interface ClassroomChatProps {
  teacherName: string;
  studentName: string;
}

export function ClassroomChat({ teacherName, studentName }: ClassroomChatProps) {
  const { languageText } = useLanguage();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to your English lesson! How are you today?",
      sender: teacherName,
      timestamp: new Date(),
      isTeacher: true,
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: studentName,
      timestamp: new Date(),
      isTeacher: false,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // In a real app, this would send to an API and perhaps trigger a response
    setTimeout(() => {
      // Simulate teacher response
      if (messages.length < 2) {
        const teacherResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "Great! Let's start with today's vocabulary.",
          sender: teacherName,
          timestamp: new Date(),
          isTeacher: true,
        };
        
        setMessages(prev => [...prev, teacherResponse]);
      }
    }, 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Sort messages to display student messages at top and teacher at bottom
  const sortedMessages = [...messages].sort((a, b) => {
    // Student messages (isTeacher: false) will come first
    if (a.isTeacher && !b.isTeacher) return 1;
    if (!a.isTeacher && b.isTeacher) return -1;
    // Within the same type, sort by timestamp (older first)
    return a.timestamp.getTime() - b.timestamp.getTime();
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border">
      <div className="p-3 bg-muted/30 border-b">
        <h3 className="font-medium">{languageText.chat}</h3>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span className="font-medium text-blue-500">{studentName} (Student)</span>
          <span className="font-medium text-green-500">{teacherName} (Teacher)</span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4 flex flex-col">
          {sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.isTeacher ? "items-start" : "items-end"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.isTeacher
                    ? "bg-muted"
                    : "bg-primary text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <span className={msg.isTeacher ? "text-green-500" : "text-blue-500"}>
                  {msg.sender}
                </span>
                <span className="mx-1">•</span>
                <span>{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-3 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          title={languageText.attachment}
        >
          <Paperclip size={18} />
        </Button>
        <Input
          placeholder={`${languageText.typeMessage}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          size="icon"
          className="shrink-0"
          disabled={!message.trim()}
        >
          <SendHorizontal size={18} />
        </Button>
      </div>
    </div>
  );
}
