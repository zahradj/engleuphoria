
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EpicBook, ReadingAssignment } from "@/types/reading";
import { BookOpen, Clock, Star, ExternalLink, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const StudentReadingZone = () => {
  const { toast } = useToast();
  
  // Mock data - in real app this would come from the student's assignments
  const [assignments] = useState<ReadingAssignment[]>([
    {
      id: "assign_1",
      bookId: "epic_1",
      studentId: "student_1",
      assignedBy: "Ms. Johnson",
      assignedAt: new Date("2024-12-01"),
      dueDate: new Date("2024-12-15"),
      xpReward: 50,
      status: 'assigned'
    }
  ]);

  const [books] = useState<EpicBook[]>([
    {
      id: "epic_1",
      title: "Animals in the Jungle",
      author: "Sarah Johnson",
      description: "Explore the amazing animals that live in jungle habitats around the world.",
      thumbnail: "/placeholder.svg",
      epicUrl: "https://www.getepic.com/app/read/12345",
      readingLevel: "Level K",
      genre: ["Science", "Animals"],
      ageRange: "5-7",
      estimatedMinutes: 15,
      tags: ["animals", "jungle", "science"],
      isRequired: false
    }
  ]);

  const assignedBooks = assignments.map(assignment => {
    const book = books.find(b => b.id === assignment.bookId);
    return { assignment, book };
  }).filter(item => item.book);

  const handleStartReading = (epicUrl: string, assignmentId: string) => {
    // Track reading start
    toast({
      title: "Happy Reading! 📚",
      description: "Opening your book on Epic. Come back when you're done to earn XP!",
    });
    window.open(epicUrl, '_blank');
  };

  const handleMarkComplete = (assignmentId: string) => {
    toast({
      title: "Book Completed! 🎉",
      description: "Great job! You earned 50 XP for completing this book.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        <h1 className="text-2xl font-bold text-gray-800">My Reading Zone</h1>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Books Read</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">120</p>
                <p className="text-sm text-muted-foreground">Minutes Reading</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">350</p>
                <p className="text-sm text-muted-foreground">Reading XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Assigned Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No books assigned yet</p>
              <p className="text-sm text-gray-500">Check back later for new reading assignments!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedBooks.map(({ assignment, book }) => (
                <div key={assignment.id} className="flex gap-4 p-4 border rounded-lg">
                  <img 
                    src={book!.thumbnail} 
                    alt={book!.title}
                    className="w-20 h-24 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{book!.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book!.author}</p>
                      </div>
                      <Badge variant={assignment.status === 'completed' ? 'default' : 'secondary'}>
                        {assignment.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {book!.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {book!.estimatedMinutes} min
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {book!.readingLevel}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                        <Star size={12} />
                        {assignment.xpReward} XP
                      </div>
                    </div>
                    
                    {assignment.dueDate && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Due: {assignment.dueDate.toLocaleDateString()}
                      </p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleStartReading(book!.epicUrl, assignment.id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Read on Epic
                      </Button>
                      
                      {assignment.status === 'reading' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarkComplete(assignment.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reading Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Reading Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="h-8 w-8 text-yellow-600" />
              </div>
              <p className="text-sm font-medium">First Book</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Speed Reader</p>
              <p className="text-xs text-muted-foreground">Read 5 books</p>
            </div>
            
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Explorer</p>
              <p className="text-xs text-muted-foreground">Read 3 genres</p>
            </div>
            
            <div className="text-center opacity-50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium">Dedicated Reader</p>
              <p className="text-xs text-muted-foreground">300 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
