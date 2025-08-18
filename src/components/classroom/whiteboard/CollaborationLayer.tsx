import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Users, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  Heart,
  ThumbsUp,
  Star,
  Smile,
  X,
  Send
} from 'lucide-react';

interface Cursor {
  id: string;
  user: {
    id: string;
    name: string;
    color: string;
    role: 'teacher' | 'student';
  };
  x: number;
  y: number;
  isActive: boolean;
  tool?: string;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    role: 'teacher' | 'student';
  };
  x: number;
  y: number;
  content: string;
  timestamp: Date;
  reactions: Array<{
    type: string;
    userId: string;
    userName: string;
  }>;
  isResolved?: boolean;
}

interface CollaborationLayerProps {
  cursors: Record<string, Cursor>;
  comments: Comment[];
  zoom: number;
  onAddComment: (x: number, y: number, content: string) => void;
  onAddReaction?: (commentId: string, type: string) => void;
  onResolveComment?: (commentId: string) => void;
}

export function CollaborationLayer({
  cursors,
  comments,
  zoom,
  onAddComment,
  onAddReaction,
  onResolveComment
}: CollaborationLayerProps) {
  const [showCursors, setShowCursors] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState<{
    x: number;
    y: number;
    content: string;
    isVisible: boolean;
  }>({ x: 0, y: 0, content: '', isVisible: false });

  // Handle double click to add comment
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (e.detail === 2) { // Double click
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      setNewComment({
        x,
        y,
        content: '',
        isVisible: true
      });
    }
  };

  // Submit new comment
  const handleSubmitComment = () => {
    if (newComment.content.trim()) {
      onAddComment(newComment.x, newComment.y, newComment.content);
      setNewComment({ x: 0, y: 0, content: '', isVisible: false });
    }
  };

  // Cancel new comment
  const handleCancelComment = () => {
    setNewComment({ x: 0, y: 0, content: '', isVisible: false });
  };

  const reactionIcons = {
    like: ThumbsUp,
    love: Heart,
    star: Star,
    smile: Smile
  };

  return (
    <>
      {/* Collaboration Controls */}
      <div className="absolute top-4 left-4 flex gap-2">
        <Button
          variant={showCursors ? "default" : "outline"}
          size="sm"
          onClick={() => setShowCursors(!showCursors)}
          title="Toggle Cursors"
        >
          <Users className="h-4 w-4" />
          {Object.keys(cursors).length}
        </Button>
        
        <Button
          variant={showComments ? "default" : "outline"}
          size="sm"
          onClick={() => setShowComments(!showComments)}
          title="Toggle Comments"
        >
          <MessageCircle className="h-4 w-4" />
          {comments.filter(c => !c.isResolved).length}
        </Button>
      </div>

      {/* Live Cursors */}
      {showCursors && Object.values(cursors).map((cursor) => (
        <div
          key={cursor.id}
          className="absolute pointer-events-none z-50 transition-all duration-100"
          style={{
            left: cursor.x * zoom,
            top: cursor.y * zoom,
            transform: `scale(${zoom})`
          }}
        >
          {/* Cursor */}
          <div 
            className="relative"
            style={{ color: cursor.user.color }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M3 3L17 8L10 10L8 17L3 3Z"
                fill="currentColor"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* User label */}
            <div 
              className="absolute top-5 left-2 px-2 py-1 text-xs text-white rounded-md whitespace-nowrap"
              style={{ backgroundColor: cursor.user.color }}
            >
              {cursor.user.name}
              {cursor.user.role === 'teacher' && (
                <span className="ml-1">👩‍🏫</span>
              )}
            </div>

            {/* Tool indicator */}
            {cursor.tool && cursor.tool !== 'select' && (
              <div
                className="absolute -top-6 left-2 px-1 py-0.5 text-xs bg-black text-white rounded"
              >
                {cursor.tool}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Comments */}
      {showComments && comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute z-40"
          style={{
            left: comment.x * zoom,
            top: comment.y * zoom,
            transform: `scale(${Math.max(0.8, zoom)})`
          }}
        >
          {/* Comment Pin */}
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer ${
              comment.isResolved 
                ? 'bg-gray-400' 
                : comment.user.role === 'teacher' 
                  ? 'bg-blue-500' 
                  : 'bg-orange-500'
            }`}
          >
            <MessageCircle className="h-3 w-3 text-white" />
          </div>

          {/* Comment Bubble */}
          <Card className="absolute top-8 left-0 w-64 shadow-lg">
            <CardContent className="p-3 space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {comment.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{comment.user.name}</div>
                    <div className="text-xs text-gray-500">
                      {comment.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {comment.user.role === 'teacher' && (
                  <Badge variant="secondary" className="text-xs">
                    Teacher
                  </Badge>
                )}
              </div>

              {/* Content */}
              <p className="text-sm">{comment.content}</p>

              {/* Reactions */}
              {comment.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {Object.entries(
                    comment.reactions.reduce((acc, r) => {
                      acc[r.type] = (acc[r.type] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => {
                    const ReactionIcon = reactionIcons[type as keyof typeof reactionIcons];
                    return (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => onAddReaction?.(comment.id, type)}
                      >
                        <ReactionIcon className="h-3 w-3 mr-1" />
                        {count}
                      </Button>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {Object.entries(reactionIcons).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => onAddReaction?.(comment.id, type)}
                      title={`Add ${type}`}
                    >
                      <Icon className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                
                {!comment.isResolved && onResolveComment && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => onResolveComment(comment.id)}
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}

      {/* New Comment Input */}
      {newComment.isVisible && (
        <div
          className="absolute z-50"
          style={{
            left: newComment.x * zoom,
            top: newComment.y * zoom,
            transform: `scale(${Math.max(0.8, zoom)})`
          }}
        >
          <Card className="w-64 shadow-lg">
            <CardContent className="p-3 space-y-2">
              <div className="text-sm font-medium">Add Comment</div>
              <Textarea
                placeholder="Type your comment..."
                value={newComment.content}
                onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[60px] text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.content.trim()}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Post
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelComment}
                >
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interaction Layer */}
      <div
        className="absolute inset-0 pointer-events-auto"
        onDoubleClick={handleDoubleClick}
        style={{ zIndex: -1 }}
      />
    </>
  );
}