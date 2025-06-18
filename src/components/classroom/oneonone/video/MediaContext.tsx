
import React, { createContext, useContext, ReactNode } from 'react';

interface MediaContextType {
  roomId: string;
}

interface MediaProviderProps {
  children: ReactNode;
  roomId: string;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children, roomId }: MediaProviderProps) {
  return (
    <MediaContext.Provider value={{ roomId }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaContext() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaContext must be used within a MediaProvider');
  }
  return context;
}
