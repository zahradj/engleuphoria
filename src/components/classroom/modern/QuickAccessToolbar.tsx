import { Pen, Presentation, MessageCircle, Book, Star, Link, Settings } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface QuickAccessToolbarProps {
  onWhiteboardClick: () => void;
  onSlidesClick: () => void;
  onChatClick: () => void;
  onDictionaryClick: () => void;
  onRewardsClick: () => void;
  onEmbedClick: () => void;
  onSettingsClick: () => void;
  unreadChatCount?: number;
  activeView?: "whiteboard" | "slides" | "chat" | "dictionary" | "rewards" | "embed";
}

export function QuickAccessToolbar({
  onWhiteboardClick,
  onSlidesClick,
  onChatClick,
  onDictionaryClick,
  onRewardsClick,
  onEmbedClick,
  onSettingsClick,
  unreadChatCount = 0,
  activeView
}: QuickAccessToolbarProps) {
  const tools = [
    {
      id: "whiteboard",
      icon: Pen,
      label: "Whiteboard",
      onClick: onWhiteboardClick,
      badge: null
    },
    {
      id: "slides",
      icon: Presentation,
      label: "Slides",
      onClick: onSlidesClick,
      badge: null
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Chat",
      onClick: onChatClick,
      badge: unreadChatCount > 0 ? unreadChatCount : null
    },
    {
      id: "dictionary",
      icon: Book,
      label: "Dictionary",
      onClick: onDictionaryClick,
      badge: null
    },
    {
      id: "rewards",
      icon: Star,
      label: "Rewards",
      onClick: onRewardsClick,
      badge: null
    },
    {
      id: "embed",
      icon: Link,
      label: "Embed",
      onClick: onEmbedClick,
      badge: null
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      onClick: onSettingsClick,
      badge: null
    }
  ];

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-4">
      <div className="glass-strong rounded-2xl px-4 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeView === tool.id;
            
            return (
              <div key={tool.id} className="relative">
                <GlassButton
                  size="lg"
                  variant={isActive ? "primary" : "default"}
                  onClick={tool.onClick}
                  className={cn(
                    "w-12 h-12 p-0 flex items-center justify-center relative group",
                    isActive && "bg-primary/20 glow-primary"
                  )}
                  glow={isActive}
                  aria-label={tool.label}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "text-foreground"
                  )} />
                </GlassButton>

                {/* Badge for notifications */}
                {tool.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                  >
                    {tool.badge > 9 ? "9+" : tool.badge}
                  </Badge>
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="glass-light px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap">
                    {tool.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
