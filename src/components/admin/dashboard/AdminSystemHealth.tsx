import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Wifi, 
  Shield, 
  Clock,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  icon: React.ElementType;
  unit?: string;
  description: string;
}

interface AdminSystemHealthProps {
  metrics?: {
    serverUptime: number;
    databaseHealth: number;
    apiResponseTime: number;
    activeConnections: number;
    memoryUsage: number;
    storageUsage: number;
  };
  loading?: boolean;
}

export const AdminSystemHealth = ({ metrics, loading }: AdminSystemHealthProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'critical':
        return XCircle;
      default:
        return Activity;
    }
  };

  const getHealthStatus = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.warning) return 'healthy';
    if (value >= thresholds.critical) return 'warning';
    return 'critical';
  };

  const systemMetrics: SystemMetric[] = [
    {
      name: 'Server Uptime',
      value: metrics?.serverUptime || 99.9,
      status: getHealthStatus(metrics?.serverUptime || 99.9, { warning: 99, critical: 95 }),
      icon: Server,
      unit: '%',
      description: 'System availability'
    },
    {
      name: 'Database Health',
      value: metrics?.databaseHealth || 98.5,
      status: getHealthStatus(metrics?.databaseHealth || 98.5, { warning: 95, critical: 90 }),
      icon: Database,
      unit: '%',
      description: 'Database performance'
    },
    {
      name: 'API Response',
      value: metrics?.apiResponseTime || 125,
      status: metrics?.apiResponseTime ? (metrics.apiResponseTime <= 200 ? 'healthy' : metrics.apiResponseTime <= 500 ? 'warning' : 'critical') : 'healthy',
      icon: Wifi,
      unit: 'ms',
      description: 'Average response time'
    },
    {
      name: 'Active Users',
      value: metrics?.activeConnections || 1247,
      status: 'healthy',
      icon: Shield,
      description: 'Currently online'
    },
    {
      name: 'Memory Usage',
      value: metrics?.memoryUsage || 67,
      status: getHealthStatus(100 - (metrics?.memoryUsage || 67), { warning: 70, critical: 50 }),
      icon: Activity,
      unit: '%',
      description: 'Server memory utilization'
    },
    {
      name: 'Storage Usage',
      value: metrics?.storageUsage || 43,
      status: getHealthStatus(100 - (metrics?.storageUsage || 43), { warning: 70, critical: 50 }),
      icon: Clock,
      unit: '%',
      description: 'Disk space utilization'
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealth = systemMetrics.reduce((acc, metric) => {
    const score = metric.status === 'healthy' ? 100 : metric.status === 'warning' ? 75 : 50;
    return acc + score;
  }, 0) / systemMetrics.length;

  const overallStatus = overallHealth >= 90 ? 'healthy' : overallHealth >= 75 ? 'warning' : 'critical';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            System Health
          </CardTitle>
          <Badge className={getStatusColor(overallStatus)}>
            {overallHealth.toFixed(1)}% Healthy
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            const StatusIcon = getStatusIcon(metric.status);
            
            return (
              <div key={index} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-sm">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${metric.status === 'healthy' ? 'text-green-500' : metric.status === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
                    <span className="font-semibold text-sm">
                      {metric.value}{metric.unit}
                    </span>
                  </div>
                </div>
                
                {(metric.name.includes('Usage') || metric.name.includes('Health') || metric.name.includes('Uptime')) && (
                  <div className="space-y-2">
                    <Progress 
                      value={metric.value} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                )}
                
                {!metric.name.includes('Usage') && !metric.name.includes('Health') && !metric.name.includes('Uptime') && (
                  <p className="text-xs text-gray-500">{metric.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};