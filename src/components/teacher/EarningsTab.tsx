
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Calendar, Download, CreditCard } from "lucide-react";

export const EarningsTab = () => {
  const earningsData = {
    thisWeek: 450,
    thisMonth: 1850,
    totalEarnings: 12600,
    pendingPayment: 320,
    classesThisWeek: 18,
    averageRating: 4.9
  };

  const recentPayments = [
    {
      id: 1,
      date: "Dec 1, 2024",
      amount: 520,
      status: "paid",
      period: "Nov 18-30, 2024",
      classes: 20
    },
    {
      id: 2,
      date: "Nov 15, 2024", 
      amount: 480,
      status: "paid",
      period: "Nov 1-15, 2024",
      classes: 18
    },
    {
      id: 3,
      date: "Pending",
      amount: 320,
      status: "pending",
      period: "Dec 1-6, 2024",
      classes: 12
    }
  ];

  const upcomingClasses = [
    {
      student: "Alex Johnson",
      date: "Today, 2:00 PM",
      rate: 25,
      duration: "1 hour"
    },
    {
      student: "Maria Garcia",
      date: "Tomorrow, 10:00 AM", 
      rate: 25,
      duration: "1 hour"
    },
    {
      student: "Group Class - Beginners",
      date: "Tomorrow, 3:00 PM",
      rate: 60,
      duration: "1.5 hours"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Earnings & Payments</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-800">${earningsData.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-800">${earningsData.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800">${earningsData.totalEarnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-800">${earningsData.pendingPayment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">${payment.amount}</h3>
                    <p className="text-sm text-gray-600">{payment.period}</p>
                    <p className="text-xs text-gray-500">
                      {payment.classes} classes • {payment.date}
                    </p>
                  </div>
                  <Badge 
                    variant={payment.status === "paid" ? "default" : "secondary"}
                    className={payment.status === "paid" ? "bg-green-500" : "bg-orange-500"}
                  >
                    {payment.status === "paid" ? "Paid" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classInfo, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">{classInfo.student}</h3>
                    <p className="text-sm text-gray-600">{classInfo.date}</p>
                    <p className="text-xs text-gray-500">{classInfo.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${classInfo.rate}</p>
                    <p className="text-xs text-gray-500">Per class</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-teal-600">{earningsData.classesThisWeek}</p>
              <p className="text-sm text-gray-600">Classes This Week</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">{earningsData.averageRating}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">${(earningsData.thisWeek / earningsData.classesThisWeek).toFixed(0)}</p>
              <p className="text-sm text-gray-600">Average Per Class</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
