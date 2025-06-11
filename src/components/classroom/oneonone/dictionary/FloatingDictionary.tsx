
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Volume2, BookPlus, X, Minimize2, Maximize2 } from "lucide-react";
import { useDictionaryService } from "./useDictionaryService";

interface FloatingDictionaryProps {
  isVisible: boolean;
  onClose: () => void;
  initialWord?: string;
  onAddToVocab?: (word: string, definition: string) => void;
}

export function FloatingDictionary({ 
  isVisible, 
  onClose, 
  initialWord = "",
  onAddToVocab 
}: FloatingDictionaryProps) {
  const [searchTerm, setSearchTerm] = useState(initialWord);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const { 
    definition, 
    isLoading, 
    error, 
    searchWord, 
    playPronunciation,
    recentSearches 
  } = useDictionaryService();

  useEffect(() => {
    if (initialWord && isVisible) {
      setSearchTerm(initialWord);
      searchWord(initialWord);
    }
  }, [initialWord, isVisible, searchWord]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchWord(searchTerm.trim());
    }
  };

  const handleAddToVocab = () => {
    if (definition && onAddToVocab) {
      onAddToVocab(definition.word, definition.definition);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        if (!isVisible) {
          // Get selected text if any
          const selection = window.getSelection()?.toString().trim();
          if (selection) {
            setSearchTerm(selection);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 select-none"
      style={{ 
        left: position.x, 
        top: position.y,
        width: isMinimized ? 'auto' : '320px'
      }}
    >
      <Card className="shadow-xl border-2 bg-white">
        {/* Draggable Header */}
        <CardHeader 
          ref={dragRef}
          className="pb-2 cursor-move bg-blue-50 rounded-t-lg"
          onMouseDown={(e) => {
            setIsDragging(true);
            const rect = dragRef.current?.getBoundingClientRect();
            if (rect) {
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              
              const handleMouseMove = (e: MouseEvent) => {
                setPosition({
                  x: e.clientX - offsetX,
                  y: e.clientY - offsetY
                });
              };
              
              const handleMouseUp = () => {
                setIsDragging(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search size={16} className="text-blue-600" />
              <span className="font-medium text-sm">Dictionary</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 space-y-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a word..."
                className="text-sm"
              />
              <Button type="submit" size="sm" disabled={isLoading}>
                <Search size={14} />
              </Button>
            </form>

            {/* Recent Searches */}
            {recentSearches.length > 0 && !definition && (
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2">Recent</div>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.slice(0, 5).map((word, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        setSearchTerm(word);
                        searchWord(word);
                      }}
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-xs text-gray-500 mt-2">Looking up word...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-4 text-red-600">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Definition Display */}
            {definition && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{definition.word}</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playPronunciation(definition.word)}
                      className="h-6 w-6 p-0"
                    >
                      <Volume2 size={12} />
                    </Button>
                    {onAddToVocab && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddToVocab}
                        className="h-6 w-6 p-0"
                      >
                        <BookPlus size={12} />
                      </Button>
                    )}
                  </div>
                </div>

                {definition.phonetic && (
                  <p className="text-sm text-gray-600 italic">
                    /{definition.phonetic}/
                  </p>
                )}

                {definition.partOfSpeech && (
                  <Badge variant="outline" className="text-xs">
                    {definition.partOfSpeech}
                  </Badge>
                )}

                <div>
                  <p className="text-sm">{definition.definition}</p>
                </div>

                {definition.example && (
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600 mb-1">Example:</p>
                    <p className="text-sm italic">"{definition.example}"</p>
                  </div>
                )}

                {definition.synonyms && definition.synonyms.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Similar words:</p>
                    <div className="flex flex-wrap gap-1">
                      {definition.synonyms.slice(0, 3).map((synonym, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs cursor-pointer"
                          onClick={() => {
                            setSearchTerm(synonym);
                            searchWord(synonym);
                          }}
                        >
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
