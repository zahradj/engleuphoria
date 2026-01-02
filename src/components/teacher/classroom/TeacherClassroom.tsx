import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLessonContext } from "@/contexts/LessonContext";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight, 
  BookOpen, 
  Library, 
  StickyNote, 
  Search,
  Video,
  Image,
  FileText,
  Gamepad2,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Phone,
  Settings,
  Users,
  Clock,
  Maximize2
} from "lucide-react";

interface TeacherClassroomProps {
  studentName?: string;
  lessonTitle?: string;
}

export const TeacherClassroom: React.FC<TeacherClassroomProps> = ({
  studentName = "Emma",
  lessonTitle = "Magic Forest: Lesson 1"
}) => {
  const { lessons, getPlaygroundLessons } = useLessonContext();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Mock library assets
  const libraryAssets = [
    { id: 1, name: "Alphabet Flashcards", type: "pdf", category: "Vocabulary" },
    { id: 2, name: "Animal Sounds Audio", type: "audio", category: "Listening" },
    { id: 3, name: "Colors Poster", type: "image", category: "Visual Aids" },
    { id: 4, name: "Numbers 1-10 Worksheet", type: "pdf", category: "Writing" },
    { id: 5, name: "Family Members Video", type: "video", category: "Speaking" },
    { id: 6, name: "Weather Icons Set", type: "image", category: "Vocabulary" },
    { id: 7, name: "Greetings Game", type: "game", category: "Interactive" },
    { id: 8, name: "Body Parts Diagram", type: "image", category: "Visual Aids" },
  ];

  const filteredAssets = libraryAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePushAsset = (assetName: string) => {
    console.log(`[PUSH ACTION] Sent "${assetName}" to Student Board at ${new Date().toISOString()}`);
    toast({
      title: "Asset Sent!",
      description: `Sent "${assetName}" to Student Board`,
      className: "bg-emerald-900 border-emerald-700 text-white",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'game': return <Gamepad2 className="h-4 w-4" />;
      case 'slide': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const playgroundLessons = getPlaygroundLessons();

  return (
    <div className="h-screen w-full bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Top Control Bar */}
      <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-400">LIVE</span>
          </div>
          <div className="h-6 w-px bg-gray-700" />
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm">{studentName}</span>
          </div>
          <Badge variant="secondary" className="bg-gray-800 text-gray-300">
            {lessonTitle}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-400 mr-4">
            <Clock className="h-4 w-4" />
            <span>00:15:32</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-300'}`}
            onClick={() => setIsCameraOff(!isCameraOff)}
          >
            {isCameraOff ? <CameraOff className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-800 text-gray-300"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700"
          >
            <Phone className="h-4 w-4 mr-2" />
            End Class
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Area (75%) */}
        <div className="w-3/4 p-4 flex flex-col">
          {/* Student Video Feed */}
          <div className="flex-1 relative bg-gray-800 rounded-xl overflow-hidden">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👧</span>
                </div>
                <p className="text-gray-400 text-lg">{studentName}'s Video</p>
                <p className="text-gray-500 text-sm mt-1">Camera feed will appear here</p>
              </div>
            </div>

            {/* Student Name Overlay */}
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <span className="text-sm font-medium">{studentName}</span>
            </div>

            {/* Fullscreen Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-lg"
            >
              <Maximize2 className="h-5 w-5" />
            </Button>

            {/* Teacher Self-View PiP */}
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-900 rounded-xl border-2 border-gray-700 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                {isCameraOff ? (
                  <div className="text-center">
                    <CameraOff className="h-8 w-8 text-gray-500 mx-auto" />
                    <p className="text-gray-500 text-xs mt-1">Camera Off</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                      <span className="text-2xl">👩‍🏫</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">You</p>
                  </div>
                )}
              </div>
              {isMuted && (
                <div className="absolute bottom-2 right-2 bg-red-500/80 p-1 rounded-full">
                  <MicOff className="h-3 w-3" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Sidebar - The Briefcase (25%) */}
        <div className="w-1/4 border-l border-gray-800 bg-gray-900 flex flex-col">
          <Tabs defaultValue="lesson-plan" className="flex-1 flex flex-col">
            <TabsList className="w-full bg-gray-800 rounded-none border-b border-gray-700 p-0 h-12">
              <TabsTrigger 
                value="lesson-plan" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-400 text-gray-400"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Lesson Plan
              </TabsTrigger>
              <TabsTrigger 
                value="library" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-400 text-gray-400"
              >
                <Library className="h-4 w-4 mr-2" />
                Library
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="flex-1 h-full rounded-none data-[state=active]:bg-gray-900 data-[state=active]:text-emerald-400 text-gray-400"
              >
                <StickyNote className="h-4 w-4 mr-2" />
                Notes
              </TabsTrigger>
            </TabsList>

            {/* Lesson Plan Tab */}
            <TabsContent value="lesson-plan" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Today's Lessons
                  </h3>
                  
                  {playgroundLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gray-800 rounded-lg p-3 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(lesson.type)}
                          <span className="font-medium text-sm">{lesson.title}</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            lesson.status === 'completed' 
                              ? 'border-emerald-500 text-emerald-400' 
                              : lesson.status === 'current'
                              ? 'border-amber-500 text-amber-400'
                              : 'border-gray-600 text-gray-500'
                          }`}
                        >
                          {lesson.status}
                        </Badge>
                      </div>

                      {/* Lesson Assets */}
                      <div className="space-y-2">
                        {lesson.content.vocabulary.map((word, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-900 rounded-md px-3 py-2"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Vocab:</span>
                              <span className="text-sm">{word}</span>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/50"
                              onClick={() => handlePushAsset(`Vocabulary: ${word}`)}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              PUSH
                            </Button>
                          </div>
                        ))}
                        
                        {/* Main Sentence */}
                        <div className="flex items-center justify-between bg-gray-900 rounded-md px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sentence:</span>
                            <span className="text-sm truncate max-w-[120px]">{lesson.content.sentence}</span>
                          </div>
                          <Button
                            size="sm"
                            className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/50"
                            onClick={() => handlePushAsset(`Sentence: ${lesson.content.sentence}`)}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            PUSH
                          </Button>
                        </div>

                        {/* Quiz */}
                        <div className="flex items-center justify-between bg-gray-900 rounded-md px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Quiz:</span>
                            <span className="text-sm truncate max-w-[120px]">{lesson.content.quizQuestion}</span>
                          </div>
                          <Button
                            size="sm"
                            className="h-7 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/50"
                            onClick={() => handlePushAsset(`Quiz: ${lesson.content.quizQuestion}`)}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            PUSH
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Library Tab */}
            <TabsContent value="library" className="flex-1 m-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-3 hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center">
                          {asset.type === 'pdf' && <FileText className="h-4 w-4 text-red-400" />}
                          {asset.type === 'image' && <Image className="h-4 w-4 text-blue-400" />}
                          {asset.type === 'video' && <Video className="h-4 w-4 text-purple-400" />}
                          {asset.type === 'audio' && <Mic className="h-4 w-4 text-amber-400" />}
                          {asset.type === 'game' && <Gamepad2 className="h-4 w-4 text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.category}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-900/50 ml-2"
                        onClick={() => handlePushAsset(asset.name)}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        PUSH
                      </Button>
                    </div>
                  ))}

                  {filteredAssets.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Library className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No files found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="flex-1 m-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Session Notes
                </h3>
                <Textarea
                  placeholder="Type notes about this session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 resize-none"
                />
                <div className="mt-3 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    onClick={() => {
                      console.log('[NOTES SAVED]', notes);
                      toast({
                        title: "Notes Saved",
                        description: "Your session notes have been saved.",
                        className: "bg-gray-800 border-gray-700 text-white",
                      });
                    }}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom;
