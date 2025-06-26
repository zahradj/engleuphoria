
import React from "react";

interface VideoErrorDisplayProps {
  error: string | null;
}

export function VideoErrorDisplay({ error }: VideoErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
      {error}
    </div>
  );
}
