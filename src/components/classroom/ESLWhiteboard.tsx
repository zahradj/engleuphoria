
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { WhiteboardToolbar } from "./whiteboard/WhiteboardToolbar";
import { WhiteboardTabs } from "./whiteboard/WhiteboardTabs";
import { EmbedLinkDialog } from "./whiteboard/EmbedLinkDialog";
import { EmbeddedLink } from "./whiteboard/EmbeddedLink";
import { useWhiteboard } from "./whiteboard/useWhiteboard";

interface ESLWhiteboardProps {
  className?: string;
  isCollaborative?: boolean;
}

export function ESLWhiteboard({ className = "", isCollaborative = true }: ESLWhiteboardProps) {
  const { languageText } = useLanguage();
  const [isEmbedDialogOpen, setIsEmbedDialogOpen] = useState(false);
  const [embedClickPosition, setEmbedClickPosition] = useState<{ x: number; y: number } | undefined>();
  const [embeddedLinks, setEmbeddedLinks] = useState<Record<string, Array<{
    id: string;
    title: string;
    url: string;
    x: number;
    y: number;
  }>>>({});
  
  const {
    activeTab,
    setActiveTab,
    activeTool,
    setActiveTool,
    activeShape,
    setActiveShape,
    color,
    setColor,
    pageCount,
    canvasRefs,
    clearCanvas,
    downloadCanvas,
    addNewPage
  } = useWhiteboard(4); // Start with more pages by default

  const handleEmbedLink = () => {
    setIsEmbedDialogOpen(true);
  };

  const handleEmbedSubmit = (data: { url: string; title: string; x: number; y: number }) => {
    const newLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: data.title,
      url: data.url,
      x: data.x,
      y: data.y
    };

    setEmbeddedLinks(prev => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newLink]
    }));
  };

  const handleRemoveLink = (linkId: string) => {
    setEmbeddedLinks(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).filter(link => link.id !== linkId)
    }));
  };

  const handleMoveLink = (linkId: string, x: number, y: number) => {
    setEmbeddedLinks(prev => ({
      ...prev,
      [activeTab]: (prev[activeTab] || []).map(link => 
        link.id === linkId ? { ...link, x, y } : link
      )
    }));
  };

  return (
    <div className={`flex flex-col gap-3 h-[calc(100vh-12rem)] ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-2 h-full flex flex-col">
        <WhiteboardToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          activeShape={activeShape}
          color={color}
          setColor={setColor}
          clearCanvas={clearCanvas}
          downloadCanvas={downloadCanvas}
          onEmbedLink={handleEmbedLink}
        />
        
        <div className="relative flex-1">
          <WhiteboardTabs
            pageCount={pageCount}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            addNewPage={addNewPage}
            canvasRefs={canvasRefs}
            activeTool={activeTool}
            color={color}
            isCollaborative={isCollaborative}
          />
          
          {/* Embedded Links Overlay */}
          {embeddedLinks[activeTab]?.map((link) => (
            <EmbeddedLink
              key={link.id}
              link={link}
              onRemove={handleRemoveLink}
              onMove={handleMoveLink}
            />
          ))}
        </div>
        
        {/* Embed Link Dialog */}
        <EmbedLinkDialog
          isOpen={isEmbedDialogOpen}
          onClose={() => setIsEmbedDialogOpen(false)}
          onEmbed={handleEmbedSubmit}
          clickPosition={embedClickPosition}
        />
      </div>
    </div>
  );
}
