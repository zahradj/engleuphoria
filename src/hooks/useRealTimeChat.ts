
import { useState, useEffect, useCallback } from 'react';
import { chatService, ChatMessage } from '@/services/chatService';
import { useToast } from '@/hooks/use-toast';

interface UseRealTimeChatProps {
  roomId: string;
  userId: string;
  userName: string;
  userRole: 'teacher' | 'student';
}

export function useRealTimeChat({ roomId, userId, userName, userRole }: UseRealTimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        const initialMessages = await chatService.getMessages(roomId);
        setMessages(initialMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [roomId, toast]);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = chatService.subscribeToMessages(roomId, (newMessage) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.some(msg => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    });

    return unsubscribe;
  }, [roomId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    try {
      setIsSending(true);
      await chatService.sendMessage(roomId, content.trim(), userId, userName, userRole);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [roomId, userId, userName, userRole, isSending, toast]);

  const sendFile = useCallback(async (file: File) => {
    if (isSending) return;

    try {
      setIsSending(true);
      await chatService.sendFileMessage(roomId, file, userId, userName, userRole);
      toast({
        title: "File Shared",
        description: `${file.name} has been shared in the chat`,
      });
    } catch (error) {
      console.error('Failed to send file:', error);
      toast({
        title: "Error",
        description: "Failed to share file",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [roomId, userId, userName, userRole, isSending, toast]);

  return {
    messages,
    isLoading,
    isSending,
    sendMessage,
    sendFile
  };
}
