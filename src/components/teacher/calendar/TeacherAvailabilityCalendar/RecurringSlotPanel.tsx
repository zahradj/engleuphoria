import React from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

interface RecurringSlotPanelProps {
  numberOfWeeks: number;
  onWeeksChange: (weeks: number) => void;
  selectedSlots: any[];
}

export const RecurringSlotPanel = ({ 
  numberOfWeeks, 
  onWeeksChange, 
  selectedSlots 
}: RecurringSlotPanelProps) => {
  const totalSlots = selectedSlots.length * numberOfWeeks;
  
  return (
    <Card className="p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200">
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-emerald-900 mb-1">Weekly Recurring Mode</h3>
            <p className="text-sm text-emerald-700">
              Select times on the days you want to repeat, then choose how many weeks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <label className="text-sm font-medium text-emerald-900">Repeat for:</label>
          <Select value={numberOfWeeks.toString()} onValueChange={(v) => onWeeksChange(parseInt(v))}>
            <SelectTrigger className="w-[180px] bg-white border-emerald-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 week</SelectItem>
              <SelectItem value="2">2 weeks</SelectItem>
              <SelectItem value="4">4 weeks</SelectItem>
              <SelectItem value="6">6 weeks</SelectItem>
              <SelectItem value="8">8 weeks</SelectItem>
              <SelectItem value="12">12 weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedSlots.length > 0 && (
          <div className="pt-2 border-t border-emerald-200">
            <p className="text-sm font-semibold text-emerald-900">
              📊 Preview: Creating <span className="text-emerald-600">{totalSlots} total slots</span>
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              ({selectedSlots.length} time slots × {numberOfWeeks} weeks)
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
