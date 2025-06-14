
import { useState, useEffect } from "react";

export function useEmbeddedGameState(gameUrl: string) {
  const [loadError, setLoadError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleIframeError = () => {
    console.log("Iframe failed to load:", gameUrl);
    setLoadError(true);
  };

  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully:", gameUrl);
    setLoadError(false);
    setLoadTimeout(false);
    setRetryCount(0);
  };

  const handleRetry = () => {
    setLoadError(false);
    setLoadTimeout(false);
    setRetryCount(prev => prev + 1);
  };

  // Set a timeout to detect if iframe doesn't load within reasonable time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadError) {
        console.log("Iframe load timeout for:", gameUrl);
        setLoadTimeout(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [gameUrl, loadError, retryCount]);

  return {
    loadError,
    loadTimeout,
    retryCount,
    handleIframeError,
    handleIframeLoad,
    handleRetry
  };
}
