
import React, { createContext, useContext } from "react";
import { useLocalMedia } from "@/hooks/useLocalMedia";

const MediaContext = createContext<ReturnType<typeof useLocalMedia> | null>(null);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const media = useLocalMedia();
  return (
    <MediaContext.Provider value={media}>{children}</MediaContext.Provider>
  );
}

export function useMediaContext() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMediaContext must be used within a MediaProvider");
  return ctx;
}
