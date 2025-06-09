
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

interface BalanceOverviewProps {
  weeklyEarnings: number;
  pendingPayment: number;
  totalBalance: number;
}

export const BalanceOverview = ({ 
  weeklyEarnings, 
  pendingPayment, 
  totalBalance 
}: BalanceOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">This Week</p>
              <p className="text-2xl font-bold text-green-800">${weeklyEarnings}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-orange-700 font-medium">Pending</p>
              <p className="text-2xl font-bold text-orange-800">${pendingPayment}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Balance</p>
              <p className="text-2xl font-bold text-blue-800">${totalBalance}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
