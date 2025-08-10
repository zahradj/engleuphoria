import React from "react";
import { UnifiedVideoSection } from "./UnifiedVideoSection";

interface TwoUpVideoProps {
  currentUser: any;
}

export function TwoUpVideo({ currentUser }: TwoUpVideoProps) {
  return (
    <div className="w-full h-full rounded-xl bg-muted/40 border border-border overflow-hidden">
      <UnifiedVideoSection currentUser={currentUser} />
    </div>
  );
}
