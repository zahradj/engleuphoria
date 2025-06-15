
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ChatTabContent() {
  return (
    <div className="h-full flex flex-col">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <MessageCircle size={16} />
        Class Chat
      </h4>
      <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
        <div className="space-y-2 text-sm">
          <div className="bg-blue-100 p-2 rounded">
            <span className="font-medium">Teacher:</span> Welcome to today's lesson!
          </div>
          <div className="bg-green-100 p-2 rounded">
            <span className="font-medium">Student:</span> Thank you! I'm excited to learn.
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="flex-1 px-3 py-2 border rounded text-sm"
        />
        <Button size="sm">Send</Button>
      </div>
    </div>
  );
}
