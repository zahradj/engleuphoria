import React, { useState, useEffect } from 'react';
import { Activity, Database, Globe, Server, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Mock performance monitor since monitoring module was removed
const performanceMonitor = {
  startTimer: (name: string) => {},
  endTimer: (name: string) => {}
};

interface HealthMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  unit: string;
  threshold: { warning: number; critical: number };
}

interface SystemStatus {
  database: 'online' | 'offline' | 'degraded';
  api: 'online' | 'offline' | 'degraded';
  storage: 'online' | 'offline' | 'degraded';
  auth: 'online' | 'offline' | 'degraded';
}

export function SystemHealthPanel() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'online',
    api: 'online',
    storage: 'online',
    auth: 'online',
  });
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadHealthMetrics();
    const interval = setInterval(loadHealthMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadHealthMetrics = async () => {
    performanceMonitor.startTimer('health_check');

    // Simulate health metrics (in production, these would come from your monitoring service)
    const mockMetrics: HealthMetric[] = [
      {
        name: 'CPU Usage',
        value: Math.random() * 100,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 70, critical: 90 },
      },
      {
        name: 'Memory Usage',
        value: Math.random() * 100,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 80, critical: 95 },
      },
      {
        name: 'Database Response Time',
        value: Math.random() * 1000 + 50,
        status: 'healthy',
        unit: 'ms',
        threshold: { warning: 500, critical: 1000 },
      },
      {
        name: 'API Response Time',
        value: Math.random() * 2000 + 100,
        status: 'healthy',
        unit: 'ms',
        threshold: { warning: 1000, critical: 2000 },
      },
      {
        name: 'Error Rate',
        value: Math.random() * 10,
        status: 'healthy',
        unit: '%',
        threshold: { warning: 5, critical: 10 },
      },
      {
        name: 'Active Users',
        value: Math.floor(Math.random() * 1000 + 100),
        status: 'healthy',
        unit: '',
        threshold: { warning: 800, critical: 950 },
      },
    ];

    // Determine status based on thresholds
    const metricsWithStatus = mockMetrics.map(metric => {
      let status: HealthMetric['status'] = 'healthy';
      if (metric.value >= metric.threshold.critical) {
        status = 'critical';
      } else if (metric.value >= metric.threshold.warning) {
        status = 'warning';
      }
      return { ...metric, status };
    });

    setMetrics(metricsWithStatus);
    setLastUpdate(new Date());
    
    performanceMonitor.endTimer('health_check');
  };

  const getStatusColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
    }
  };

  const getProgressColor = (status: HealthMetric['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
    }
  };

  const getSystemStatusBadge = (status: SystemStatus[keyof SystemStatus]) => {
    const variants = {
      online: { variant: 'default' as const, text: 'Online' },
      offline: { variant: 'destructive' as const, text: 'Offline' },
      degraded: { variant: 'secondary' as const, text: 'Degraded' },
    };

    const config = variants[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="text-sm font-medium">Database</span>
              </div>
              {getSystemStatusBadge(systemStatus.database)}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <span className="text-sm font-medium">API</span>
              </div>
              {getSystemStatusBadge(systemStatus.api)}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              {getSystemStatusBadge(systemStatus.storage)}
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Auth</span>
              </div>
              {getSystemStatusBadge(systemStatus.auth)}
            </div>
          </div>

          <div className="grid gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <span className={`text-sm ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(metric.unit === 'ms' ? 0 : 1)}{metric.unit}
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min((metric.value / metric.threshold.critical) * 100, 100)} 
                    className="h-2"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(metric.status)}`}
                    style={{ 
                      width: `${Math.min((metric.value / metric.threshold.critical) * 100, 100)}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                  <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button onClick={loadHealthMetrics} variant="outline" size="sm">
              Refresh Metrics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}