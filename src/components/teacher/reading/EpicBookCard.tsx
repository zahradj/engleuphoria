
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EpicBook } from "@/types/reading";
import { ExternalLink, Clock, BookOpen, Users } from "lucide-react";

interface EpicBookCardProps {
  book: EpicBook;
  onAssign?: (bookId: string) => void;
  onPreview?: (bookId: string) => void;
  showAssignButton?: boolean;
  isAssigned?: boolean;
}

export function EpicBookCard({ 
  book, 
  onAssign, 
  onPreview, 
  showAssignButton = true,
  isAssigned = false 
}: EpicBookCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <img 
            src={book.thumbnail} 
            alt={book.title}
            className="w-16 h-20 object-cover rounded border"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2">{book.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">by {book.author}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {book.readingLevel}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {book.ageRange}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {book.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
          <Clock size={12} />
          <span>{book.estimatedMinutes} min</span>
          <BookOpen size={12} />
          <span>{book.genre.join(", ")}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 text-xs"
            onClick={() => window.open(book.epicUrl, '_blank')}
          >
            <ExternalLink size={12} className="mr-1" />
            Read on Epic
          </Button>
          
          {showAssignButton && (
            <Button 
              size="sm" 
              className="flex-1 text-xs"
              onClick={() => onAssign?.(book.id)}
              disabled={isAssigned}
            >
              <Users size={12} className="mr-1" />
              {isAssigned ? 'Assigned' : 'Assign'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
