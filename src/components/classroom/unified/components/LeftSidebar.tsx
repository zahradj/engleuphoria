import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Link, 
  PenTool, 
  Award, 
  MessageCircle, 
  Book,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface LeftSidebarProps {
  onToolSelect: (tool: string) => void;
  selectedTool?: string;
}

export function LeftSidebar({ onToolSelect, selectedTool }: LeftSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tools = [
    { id: 'embed', icon: Link, label: 'Embed Link', color: '#3B82F6', description: 'Share external content' },
    { id: 'whiteboard', icon: PenTool, label: 'Whiteboard', color: '#10B981', description: 'Interactive drawing' },
    { id: 'awards', icon: Award, label: 'Give Awards', color: '#F59E0B', description: 'Reward students' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#8B5CF6', description: 'Real-time messaging' },
    { id: 'dictionary', icon: Book, label: 'Dictionary', color: '#EF4444', description: 'Word definitions' }
  ];

  return (
    <TooltipProvider>
      <Card 
        className={`
          h-full bg-white/95 backdrop-blur-sm border-r-2 border-primary-200/40 
          transition-all duration-500 ease-in-out relative overflow-hidden
          shadow-xl hover:shadow-2xl
          ${isCollapsed ? 'w-16' : 'w-20'}
        `}
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          borderImage: 'linear-gradient(180deg, rgba(196, 217, 255, 0.6) 0%, rgba(197, 186, 255, 0.4) 100%) 1'
        }}
      >
        {/* Enhanced ambient glow effect */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-500"
          style={{ 
            background: 'linear-gradient(180deg, rgba(196, 217, 255, 0.15) 0%, rgba(197, 186, 255, 0.08) 100%)' 
          }}
        />

        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-transparent to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Enhanced collapse toggle */}
        <div className="absolute top-4 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0 rounded-full hover:bg-primary-100/50 transition-all duration-300 hover:scale-110"
          >
            {isCollapsed ? (
              <ChevronRight size={12} className="text-primary-600" />
            ) : (
              <ChevronLeft size={12} className="text-primary-600" />
            )}
          </Button>
        </div>

        {/* Enhanced tool buttons */}
        <div className="flex flex-col gap-4 p-4 pt-12">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            
            return (
              <Tooltip key={tool.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                    {/* Enhanced ambient glow for selected/hover */}
                    <div 
                      className={`
                        absolute -inset-3 rounded-xl blur opacity-0 transition-all duration-500
                        ${isSelected ? 'opacity-60 scale-110' : 'group-hover:opacity-40 group-hover:scale-105'}
                      `}
                      style={{ 
                        background: `linear-gradient(135deg, ${tool.color}60, ${tool.color}30)` 
                      }}
                    />
                    
                    <Button
                      variant="ghost"
                      className={`
                        relative h-12 w-12 rounded-xl transition-all duration-500 
                        border border-transparent backdrop-blur-sm group overflow-hidden
                        animate-fade-in
                        ${isSelected 
                          ? 'shadow-xl scale-110 border-2' 
                          : 'hover:shadow-lg hover:scale-105'
                        }
                      `}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(135deg, ${tool.color}20, ${tool.color}10)`
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.4))',
                        borderColor: isSelected 
                          ? `${tool.color}40` 
                          : 'rgba(196, 217, 255, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${tool.color}25, ${tool.color}12)`;
                          e.currentTarget.style.borderColor = `${tool.color}50`;
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.4))';
                          e.currentTarget.style.borderColor = 'rgba(196, 217, 255, 0.3)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                      onClick={() => onToolSelect(tool.id)}
                    >
                      {/* Enhanced animated background shimmer */}
                      <div 
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                        style={{ 
                          background: `linear-gradient(90deg, transparent 0%, ${tool.color}30 50%, transparent 100%)` 
                        }}
                      />
                      
                      {/* Enhanced floating particles */}
                      <div 
                        className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-500"
                        style={{ backgroundColor: `${tool.color}80` }}
                      />
                      <div 
                        className="absolute bottom-1 left-1 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-300 transition-opacity duration-500"
                        style={{ backgroundColor: `${tool.color}90` }}
                      />
                      <div 
                        className="absolute top-1/2 left-1/2 w-0.5 h-0.5 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"
                        style={{ backgroundColor: `${tool.color}70` }}
                      />
                      
                      <Icon 
                        size={20} 
                        className={`
                          relative z-10 transition-all duration-300 
                          ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                        `}
                        style={{ 
                          color: isSelected ? tool.color : '#64748B' 
                        }}
                      />
                      
                      {/* Enhanced selection indicator */}
                      {isSelected && (
                        <div 
                          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-8 rounded-l-full animate-pulse"
                          style={{ backgroundColor: tool.color }}
                        />
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-white/98 backdrop-blur-sm border border-primary-200/50 shadow-xl rounded-xl p-3 animate-fade-in"
                  sideOffset={12}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-sm" style={{ color: tool.color }}>
                      {tool.label}
                    </span>
                    <span className="text-xs text-gray-500">
                      {tool.description}
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Enhanced decorative elements */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-10 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary-400/60 to-transparent animate-pulse" />
        <div className="absolute top-12 left-1 w-0.5 h-12 rounded-full bg-gradient-to-b from-primary-400/60 to-transparent" />
        <div className="absolute bottom-20 right-1 w-0.5 h-8 rounded-full bg-gradient-to-t from-purple-400/40 to-transparent" />
      </Card>
    </TooltipProvider>
  );
}