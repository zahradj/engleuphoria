import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Repeat } from "lucide-react";

interface SlotTypeSelectorProps {
  slotType: 'one-time' | 'weekly-recurring';
  onTypeChange: (type: 'one-time' | 'weekly-recurring') => void;
}

export const SlotTypeSelector = ({ slotType, onTypeChange }: SlotTypeSelectorProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border border-slate-200">
      <Button
        variant={slotType === 'one-time' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('one-time')}
        className={`gap-2 transition-all ${
          slotType === 'one-time'
            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
            : 'hover:bg-slate-200/50'
        }`}
      >
        <Calendar className="h-4 w-4" />
        One-Time Slots
      </Button>
      <Button
        variant={slotType === 'weekly-recurring' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('weekly-recurring')}
        className={`gap-2 transition-all ${
          slotType === 'weekly-recurring'
            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md'
            : 'hover:bg-slate-200/50'
        }`}
      >
        <Repeat className="h-4 w-4" />
        Weekly Recurring
      </Button>
    </div>
  );
};
