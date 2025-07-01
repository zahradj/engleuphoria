
import { supabase } from '@/lib/supabase';

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'teacher' | 'student';
  room_id: string;
  created_at: string;
  message_type: 'text' | 'file' | 'system';
  file_url?: string;
  file_name?: string;
}

class ChatService {
  private listeners: Map<string, (message: ChatMessage) => void> = new Map();
  private channels: Map<string, any> = new Map();

  async sendMessage(
    roomId: string, 
    content: string, 
    senderId: string, 
    senderName: string, 
    senderRole: 'teacher' | 'student'
  ): Promise<void> {
    try {
      console.log('📧 ChatService: Sending message to room:', roomId);
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content,
          sender_id: senderId,
          sender_name: senderName,
          sender_role: senderRole,
          room_id: roomId,
          message_type: 'text'
        });

      if (error) {
        console.error('📧 ChatService: Send message error:', error);
        throw new Error(`Failed to send message: ${error.message}`);
      }
      
      console.log('📧 ChatService: Message sent successfully');
    } catch (error: any) {
      console.error('📧 ChatService: Send message failed:', error);
      throw error;
    }
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    try {
      console.log('📧 ChatService: Fetching messages for room:', roomId);
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('📧 ChatService: Fetch messages error:', error);
        throw new Error(`Failed to fetch messages: ${error.message}`);
      }
      
      console.log(`📧 ChatService: Fetched ${data?.length || 0} messages`);
      return data || [];
    } catch (error: any) {
      console.error('📧 ChatService: Get messages failed:', error);
      throw error;
    }
  }

  subscribeToMessages(roomId: string, onMessage: (message: ChatMessage) => void): () => void {
    const channelName = `chat_${roomId}`;
    
    console.log('📧 ChatService: Subscribing to messages for channel:', channelName);
    
    // Clean up existing channel if it exists
    if (this.channels.has(channelName)) {
      const existingChannel = this.channels.get(channelName);
      supabase.removeChannel(existingChannel);
      console.log('📧 ChatService: Removed existing channel');
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          console.log('📧 ChatService: New message received via realtime:', payload);
          onMessage(payload.new as ChatMessage);
        }
      )
      .subscribe((status) => {
        console.log('📧 ChatService: Subscription status:', status);
      });

    this.channels.set(channelName, channel);

    // Return cleanup function
    return () => {
      console.log('📧 ChatService: Unsubscribing from channel:', channelName);
      if (this.channels.has(channelName)) {
        supabase.removeChannel(this.channels.get(channelName));
        this.channels.delete(channelName);
      }
    };
  }

  async sendFileMessage(
    roomId: string,
    file: File,
    senderId: string,
    senderName: string,
    senderRole: 'teacher' | 'student'
  ): Promise<void> {
    try {
      console.log('📧 ChatService: Uploading file:', file.name);
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-files/${roomId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('classroom-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('📧 ChatService: File upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('classroom-files')
        .getPublicUrl(filePath);

      console.log('📧 ChatService: File uploaded, sending message');

      // Send message with file info
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: `Shared a file: ${file.name}`,
          sender_id: senderId,
          sender_name: senderName,
          sender_role: senderRole,
          room_id: roomId,
          message_type: 'file',
          file_url: publicUrl,
          file_name: file.name
        });

      if (error) {
        console.error('📧 ChatService: File message error:', error);
        throw new Error(`Failed to send file message: ${error.message}`);
      }
      
      console.log('📧 ChatService: File message sent successfully');
    } catch (error: any) {
      console.error('📧 ChatService: Send file message failed:', error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
