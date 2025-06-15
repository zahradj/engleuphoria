
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

type IssueType = "Audio Issue" | "Video Issue" | "Internet Issue" | "Other";

interface ReportIssueDropdownProps {
  onReport: (issue: IssueType) => void;
}

export function ReportIssueDropdown({ onReport }: ReportIssueDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2"
        >
          Report Technical Issue
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => { onReport("Audio Issue"); setOpen(false); }}>Audio Issue</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { onReport("Video Issue"); setOpen(false); }}>Video Issue</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { onReport("Internet Issue"); setOpen(false); }}>Internet Issue</DropdownMenuItem>
        <DropdownMenuItem onClick={() => { onReport("Other"); setOpen(false); }}>Other</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
