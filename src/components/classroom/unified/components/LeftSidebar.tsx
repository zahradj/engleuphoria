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
    { id: 'embed', icon: Link, label: 'Embed Link', color: '#3B82F6' },
    { id: 'whiteboard', icon: PenTool, label: 'Whiteboard', color: '#10B981' },
    { id: 'awards', icon: Award, label: 'Give Awards', color: '#F59E0B' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#8B5CF6' },
    { id: 'dictionary', icon: Book, label: 'Dictionary', color: '#EF4444' }
  ];

  return (
    <TooltipProvider>
      <Card 
        className={`
          h-full bg-white/80 backdrop-blur-sm border-r-2 border-primary-200/40 
          transition-all duration-300 ease-in-out relative overflow-hidden
          ${isCollapsed ? 'w-16' : 'w-20'}
        `}
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          borderImage: 'linear-gradient(180deg, rgba(196, 217, 255, 0.4) 0%, rgba(197, 186, 255, 0.3) 100%) 1'
        }}
      >
        {/* Ambient glow effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            background: 'linear-gradient(180deg, rgba(196, 217, 255, 0.1) 0%, rgba(197, 186, 255, 0.05) 100%)' 
          }}
        />

        {/* Collapse toggle */}
        <div className="absolute top-4 right-2 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-6 w-6 p-0 rounded-full hover:bg-primary-100/50"
          >
            {isCollapsed ? (
              <ChevronRight size={12} className="text-primary-600" />
            ) : (
              <ChevronLeft size={12} className="text-primary-600" />
            )}
          </Button>
        </div>

        {/* Tool buttons */}
        <div className="flex flex-col gap-3 p-4 pt-12">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool === tool.id;
            
            return (
              <Tooltip key={tool.id} delayDuration={300}>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    {/* Ambient glow for selected/hover */}
                    <div 
                      className={`
                        absolute -inset-2 rounded-xl blur opacity-0 transition-opacity duration-300
                        ${isSelected ? 'opacity-40' : 'group-hover:opacity-30'}
                      `}
                      style={{ 
                        background: `linear-gradient(135deg, ${tool.color}40, ${tool.color}20)` 
                      }}
                    />
                    
                    <Button
                      variant="ghost"
                      className={`
                        relative h-12 w-12 rounded-xl transition-all duration-300 
                        border border-transparent backdrop-blur-sm group overflow-hidden
                        ${isSelected 
                          ? 'shadow-lg scale-105' 
                          : 'hover:shadow-md hover:scale-102'
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
                          e.currentTarget.style.background = `linear-gradient(135deg, ${tool.color}15, ${tool.color}08)`;
                          e.currentTarget.style.borderColor = `${tool.color}30`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.4))';
                          e.currentTarget.style.borderColor = 'rgba(196, 217, 255, 0.3)';
                        }
                      }}
                      onClick={() => onToolSelect(tool.id)}
                    >
                      {/* Animated background shimmer */}
                      <div 
                        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                        style={{ 
                          background: `linear-gradient(90deg, transparent 0%, ${tool.color}20 50%, transparent 100%)` 
                        }}
                      />
                      
                      {/* Floating particles */}
                      <div 
                        className="absolute top-1 right-1 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 animate-float transition-opacity duration-300"
                        style={{ backgroundColor: `${tool.color}60` }}
                      />
                      <div 
                        className="absolute bottom-1 left-1 w-0.5 h-0.5 rounded-full opacity-0 group-hover:opacity-100 animate-float animation-delay-300 transition-opacity duration-300"
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
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div 
                          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-l-full"
                          style={{ backgroundColor: tool.color }}
                        />
                      )}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="bg-white/95 backdrop-blur-sm border border-primary-200/50 shadow-lg"
                  sideOffset={8}
                >
                  <span className="font-medium" style={{ color: tool.color }}>
                    {tool.label}
                  </span>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary-300/50 to-transparent" />
        <div className="absolute top-8 left-1 w-0.5 h-8 rounded-full bg-gradient-to-b from-primary-300/50 to-transparent" />
      </Card>
    </TooltipProvider>
  );
}