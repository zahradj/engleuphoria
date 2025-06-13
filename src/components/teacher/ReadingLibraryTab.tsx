
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EpicBookCard } from "./reading/EpicBookCard";
import { AddEpicBookDialog } from "./reading/AddEpicBookDialog";
import { EpicBook } from "@/types/reading";
import { Plus, Search, Filter, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ReadingLibraryTab = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock data - in real app this would come from a service
  const [books, setBooks] = useState<EpicBook[]>([
    {
      id: "epic_1",
      title: "Animals in the Jungle",
      author: "Sarah Johnson",
      description: "Explore the amazing animals that live in jungle habitats around the world.",
      thumbnail: "/placeholder.svg",
      epicUrl: "https://www.getepic.com/app/read/12345",
      readingLevel: "Level K",
      lexileLevel: 200,
      genre: ["Science", "Animals"],
      ageRange: "5-7",
      estimatedMinutes: 15,
      tags: ["animals", "jungle", "science"],
      isRequired: false
    },
    {
      id: "epic_2",
      title: "The Magic School Bus: Weather",
      author: "Joanna Cole",
      description: "Join Ms. Frizzle and her class as they learn about different types of weather.",
      thumbnail: "/placeholder.svg",
      epicUrl: "https://www.getepic.com/app/read/12346",
      readingLevel: "Level 2",
      lexileLevel: 450,
      genre: ["Science", "Adventure"],
      ageRange: "6-9",
      estimatedMinutes: 20,
      tags: ["weather", "science", "magic school bus"],
      isRequired: false
    }
  ]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === "all" || book.readingLevel === selectedLevel;
    const matchesGenre = selectedGenre === "all" || book.genre.includes(selectedGenre);
    
    return matchesSearch && matchesLevel && matchesGenre;
  });

  const handleAssignBook = (bookId: string) => {
    toast({
      title: "Book Assigned",
      description: "Book has been assigned to selected students.",
    });
  };

  const handleAddBook = (bookData: Partial<EpicBook>) => {
    const newBook: EpicBook = {
      id: `epic_${Date.now()}`,
      title: bookData.title || "",
      author: bookData.author || "",
      description: bookData.description || "",
      thumbnail: bookData.thumbnail || "/placeholder.svg",
      epicUrl: bookData.epicUrl || "",
      readingLevel: bookData.readingLevel || "Level K",
      genre: bookData.genre || [],
      ageRange: bookData.ageRange || "5-7",
      estimatedMinutes: bookData.estimatedMinutes || 15,
      tags: bookData.tags || [],
      isRequired: false
    };
    
    setBooks([...books, newBook]);
    setShowAddDialog(false);
    
    toast({
      title: "Book Added",
      description: "Epic book has been added to your library.",
    });
  };

  const readingLevels = ["Level K", "Level 1", "Level 2", "Level 3", "Level 4", "Level 5"];
  const genres = ["Adventure", "Science", "Animals", "Fantasy", "History", "Biography"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h1 className="text-2xl font-bold text-gray-800">Epic Reading Library</h1>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="bg-teal-500 hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Epic Book
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search books, authors, or tags..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {readingLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.map((book) => (
          <EpicBookCard
            key={book.id}
            book={book}
            onAssign={handleAssignBook}
            showAssignButton={true}
          />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filters, or add a new Epic book.</p>
          </CardContent>
        </Card>
      )}

      <AddEpicBookDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddBook={handleAddBook}
      />
    </div>
  );
};
