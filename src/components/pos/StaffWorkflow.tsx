import React, { useState } from 'react';
import { Users, Clock, DollarSign, Target, Star, TrendingUp, CheckCircle, AlertCircle, Calendar, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StaffMember {
  id: string;
  name: string;
  role: 'server' | 'cook' | 'manager' | 'cashier';
  status: 'active' | 'break' | 'offline';
  shift: string;
  tablesAssigned?: number[];
  ordersHandled: number;
  salesTotal: number;
  rating: number;
  hoursWorked: number;
  tasks: StaffTask[];
}

interface StaffTask {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedAt: Date;
  dueTime?: Date;
}

export const StaffWorkflow: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      role: 'server',
      status: 'active',
      shift: '08:00 - 16:00',
      tablesAssigned: [1, 2, 5, 8],
      ordersHandled: 12,
      salesTotal: 485.50,
      rating: 4.8,
      hoursWorked: 6.5,
      tasks: [
        { id: '1', description: 'Clean table 5', priority: 'medium', status: 'completed', assignedAt: new Date(Date.now() - 30*60000) },
        { id: '2', description: 'Take order table 8', priority: 'high', status: 'in-progress', assignedAt: new Date(Date.now() - 15*60000) }
      ]
    },
    {
      id: '2',
      name: 'Bob Smith',
      role: 'cook',
      status: 'active',
      shift: '07:00 - 15:00',
      ordersHandled: 28,
      salesTotal: 0,
      rating: 4.9,
      hoursWorked: 7.5,
      tasks: [
        { id: '3', description: 'Prep vegetables for lunch rush', priority: 'high', status: 'completed', assignedAt: new Date(Date.now() - 60*60000) },
        { id: '4', description: 'Check grill temperature', priority: 'medium', status: 'pending', assignedAt: new Date(Date.now() - 10*60000) }
      ]
    },
    {
      id: '3',
      name: 'Carol Williams',
      role: 'server',
      status: 'break',
      shift: '12:00 - 20:00',
      tablesAssigned: [3, 4, 6, 7],
      ordersHandled: 8,
      salesTotal: 320.75,
      rating: 4.7,
      hoursWorked: 4.0,
      tasks: [
        { id: '5', description: 'Restock napkin dispensers', priority: 'low', status: 'pending', assignedAt: new Date(Date.now() - 20*60000) }
      ]
    },
    {
      id: '4',
      name: 'David Brown',
      role: 'cashier',
      status: 'active',
      shift: '10:00 - 18:00',
      ordersHandled: 35,
      salesTotal: 1250.25,
      rating: 4.6,
      hoursWorked: 5.5,
      tasks: [
        { id: '6', description: 'Count register drawer', priority: 'high', status: 'in-progress', assignedAt: new Date(Date.now() - 5*60000) }
      ]
    }
  ]);

  const getStatusColor = (status: StaffMember['status']) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'break': return 'bg-warning text-warning-foreground';
      case 'offline': return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRoleIcon = (role: StaffMember['role']) => {
    switch (role) {
      case 'server': return '👨‍💼';
      case 'cook': return '👨‍🍳';
      case 'manager': return '👔';
      case 'cashier': return '💰';
    }
  };

  const getPriorityColor = (priority: StaffTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTaskStatusIcon = (status: StaffTask['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const updateTaskStatus = (staffId: string, taskId: string, newStatus: StaffTask['status']) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId 
        ? {
            ...member,
            tasks: member.tasks.map(task => 
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        : member
    ));
  };

  const totalSales = staff.reduce((sum, member) => sum + member.salesTotal, 0);
  const totalOrders = staff.reduce((sum, member) => sum + member.ordersHandled, 0);
  const activeStaff = staff.filter(member => member.status === 'active').length;
  const avgRating = staff.reduce((sum, member) => sum + member.rating, 0) / staff.length;

  return (
    <div className="space-y-6">
      {/* Staff Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Staff Workflow</h2>
          <p className="text-muted-foreground">Monitor staff performance and manage tasks</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff Details</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Staff Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{activeStaff}</div>
              <div className="text-sm text-muted-foreground">Active Staff</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-success">${totalSales.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Sales</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{totalOrders}</div>
              <div className="text-sm text-muted-foreground">Orders Handled</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary-foreground">{avgRating.toFixed(1)}⭐</div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </Card>
          </div>

          {/* Active Tasks Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Tasks</h3>
            <div className="space-y-3">
              {staff.flatMap(member => 
                member.tasks.filter(task => task.status !== 'completed').map(task => ({
                  ...task,
                  staffName: member.name,
                  staffRole: member.role
                }))
              ).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTaskStatusIcon(task.status)}
                    <div>
                      <div className="font-medium text-sm">{task.description}</div>
                      <div className="text-xs text-muted-foreground">
                        Assigned to {task.staffName} ({task.staffRole})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)} variant="secondary">
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor((Date.now() - task.assignedAt.getTime()) / (1000 * 60))}m ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          {/* Staff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map(member => (
              <Card key={member.id} className="p-4">
                <div className="space-y-4">
                  {/* Staff Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getRoleIcon(member.role)}</div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(member.status)} variant="secondary">
                      {member.status}
                    </Badge>
                  </div>

                  {/* Shift Info */}
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Shift: {member.shift}</span>
                    </div>
                    <div className="mt-1">Hours worked: {member.hoursWorked}h</div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-muted rounded">
                      <div className="font-bold text-primary">{member.ordersHandled}</div>
                      <div className="text-muted-foreground">Orders</div>
                    </div>
                    {member.role === 'server' || member.role === 'cashier' ? (
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-bold text-success">${member.salesTotal.toFixed(0)}</div>
                        <div className="text-muted-foreground">Sales</div>
                      </div>
                    ) : (
                      <div className="text-center p-2 bg-muted rounded">
                        <div className="font-bold text-warning">{member.rating}⭐</div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                    )}
                  </div>

                  {/* Tables for servers */}
                  {member.role === 'server' && member.tablesAssigned && (
                    <div>
                      <div className="text-sm font-medium mb-2">Assigned Tables:</div>
                      <div className="flex flex-wrap gap-1">
                        {member.tablesAssigned.map(table => (
                          <Badge key={table} variant="outline" className="text-xs">
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tasks */}
                  <div>
                    <div className="text-sm font-medium mb-2">
                      Tasks ({member.tasks.filter(t => t.status !== 'completed').length} active)
                    </div>
                    <div className="space-y-1">
                      {member.tasks.slice(0, 2).map(task => (
                        <div key={task.id} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            {getTaskStatusIcon(task.status)}
                            <span className="truncate">{task.description}</span>
                          </div>
                          <Badge className={getPriorityColor(task.priority)} variant="secondary">
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Sales Performance
              </h3>
              <div className="space-y-4">
                {staff.filter(m => m.salesTotal > 0).map(member => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{member.name}</span>
                      <span className="font-semibold">${member.salesTotal.toFixed(2)}</span>
                    </div>
                    <Progress value={(member.salesTotal / Math.max(...staff.map(s => s.salesTotal))) * 100} />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Order Efficiency
              </h3>
              <div className="space-y-4">
                {staff.map(member => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{member.name}</span>
                      <span className="font-semibold">{member.ordersHandled} orders</span>
                    </div>
                    <Progress value={(member.ordersHandled / Math.max(...staff.map(s => s.ordersHandled))) * 100} />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Performance Rankings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performers Today</h3>
            <div className="space-y-3">
              {staff
                .sort((a, b) => b.salesTotal - a.salesTotal)
                .slice(0, 3)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{member.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{member.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">${member.salesTotal.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">{member.ordersHandled} orders</div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};