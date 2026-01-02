import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface SchedulerHeaderProps {
  teacherName: string;
  openSlotsCount: number;
  bookedSlotsCount: number;
}

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  teacherName,
  openSlotsCount,
  bookedSlotsCount
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {teacherName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your teaching schedule and availability
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {openSlotsCount}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Open Slots</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {bookedSlotsCount}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Booked</p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {openSlotsCount + bookedSlotsCount}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
