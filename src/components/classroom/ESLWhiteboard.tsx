
import { useLanguage } from "@/contexts/LanguageContext";
import { WhiteboardToolbar } from "./whiteboard/WhiteboardToolbar";
import { WhiteboardTabs } from "./whiteboard/WhiteboardTabs";
import { useWhiteboard } from "./whiteboard/useWhiteboard";

interface ESLWhiteboardProps {
  className?: string;
  isCollaborative?: boolean;
}

export function ESLWhiteboard({ className = "", isCollaborative = true }: ESLWhiteboardProps) {
  const { languageText } = useLanguage();
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
  } = useWhiteboard();

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm p-2">
        <WhiteboardToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          activeShape={activeShape}
          color={color}
          setColor={setColor}
          clearCanvas={clearCanvas}
          downloadCanvas={downloadCanvas}
        />
        
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
      </div>
    </div>
  );
}
