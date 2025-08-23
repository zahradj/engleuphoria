import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  Activity,
  Settings,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export const AdminOverviewTab = () => {
  const kpis = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Active Teachers',
      value: '156',
      change: '+8.2%',
      icon: GraduationCap,
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: '$18,642',
      change: '+15.3%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      title: 'System Uptime',
      value: '99.8%',
      change: '0.0%',
      icon: Activity,
      trend: 'stable'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-4',
      icon: AlertTriangle,
      trend: 'down'
    }
  ];

  const systemStatus = [
    { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
    { name: 'Database', status: 'operational', uptime: '99.8%' },
    { name: 'File Storage', status: 'operational', uptime: '100%' },
    { name: 'Authentication', status: 'maintenance', uptime: '99.5%' }
  ];

  const quickActions = [
    { label: 'Add New Teacher', icon: GraduationCap },
    { label: 'System Settings', icon: Settings },
    { label: 'Refresh Data', icon: RefreshCw },
    { label: 'Generate Report', icon: Activity }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className={`text-xs font-medium ${
                    kpi.trend === 'up' ? 'text-success' : 
                    kpi.trend === 'down' ? 'text-error' : 'text-muted-foreground'
                  }`}>
                    {kpi.change}
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Usage Chart */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Platform Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">Usage Analytics Chart</p>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div className="flex items-center gap-3">
                  {service.status === 'operational' ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <Clock className="h-4 w-4 text-warning" />
                  )}
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <Badge variant={service.status === 'operational' ? 'default' : 'secondary'} className="text-xs">
                  {service.uptime}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-5 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'New teacher registration: Sarah Johnson',
                'Course published: Advanced Grammar',
                'System backup completed',
                'Payment processed: $124.99',
                'User support ticket resolved'
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-2 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-foreground">{activity}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {index + 1}h ago
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3 border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="w-full justify-start gap-3 h-12 border-border hover:bg-primary/5 hover:border-primary/30"
              >
                <action.icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};