
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Download, Eye, Users, Clock } from "lucide-react";

export function CurriculumAnalytics() {
  const stats = [
    { label: "Total Content Items", value: "127", icon: BarChart3, color: "text-blue-600" },
    { label: "Total Downloads", value: "2,341", icon: Download, color: "text-green-600" },
    { label: "Views This Month", value: "856", icon: Eye, color: "text-purple-600" },
    { label: "Active Users", value: "34", icon: Users, color: "text-orange-600" }
  ];

  const topContent = [
    { name: "Animal Vocabulary Worksheet", downloads: 87, views: 234, type: "worksheet" },
    { name: "Family Tree Interactive Game", downloads: 76, views: 198, type: "game" },
    { name: "Weather Sounds Audio", downloads: 65, views: 167, type: "audio" },
    { name: "Daily Routines Video", downloads: 54, views: 145, type: "video" },
    { name: "Colors Matching Activity", downloads: 43, views: 123, type: "interactive" }
  ];

  const usageByLevel = [
    { level: "A1", count: 45, percentage: 35 },
    { level: "A2", count: 38, percentage: 30 },
    { level: "B1", count: 25, percentage: 20 },
    { level: "B2", count: 15, percentage: 12 },
    { level: "C1", count: 4, percentage: 3 }
  ];

  const recentActivity = [
    { action: "Upload", item: "Christmas Vocabulary Worksheet", user: "You", time: "2 hours ago" },
    { action: "Download", item: "Animal Sounds Audio", user: "Teacher Maria", time: "4 hours ago" },
    { action: "View", item: "Family Tree Game", user: "Teacher John", time: "6 hours ago" },
    { action: "Upload", item: "Winter Activities Video", user: "You", time: "1 day ago" },
    { action: "Download", item: "Weather Worksheet", user: "Teacher Sarah", time: "2 days ago" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Curriculum Library Analytics</h3>
        <p className="text-sm text-gray-600">Track usage and performance of your curriculum content</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon size={24} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Top Performing Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topContent.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Download size={12} />
                        {item.downloads}
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Eye size={12} />
                        {item.views}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage by CEFR Level */}
        <Card>
          <CardHeader>
            <CardTitle>Usage by CEFR Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usageByLevel.map((level) => (
                <div key={level.level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{level.level}</span>
                    <span className="text-sm text-gray-600">{level.count} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${level.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-l-4 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3">
                  <Badge variant={activity.action === "Upload" ? "default" : "secondary"} className="text-xs">
                    {activity.action}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{activity.item}</p>
                    <p className="text-xs text-gray-600">by {activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
