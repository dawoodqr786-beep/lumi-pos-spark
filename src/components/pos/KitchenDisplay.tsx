import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, Flame, Timer, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  station: 'grill' | 'salad' | 'fryer' | 'pizza' | 'dessert';
  status: 'pending' | 'preparing' | 'ready';
}

interface KitchenOrder {
  id: string;
  orderNumber: string;
  type: 'dine-in' | 'takeout' | 'delivery';
  tableNumber?: number;
  customerName?: string;
  items: OrderItem[];
  startTime: Date;
  estimatedTime: number; // minutes
  priority: 'low' | 'normal' | 'high' | 'urgent';
  server: string;
  specialInstructions?: string;
}

interface KitchenDisplayProps {
  staffFilter?: string;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ staffFilter }) => {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: '1',
      orderNumber: 'ORD-001',
      type: 'dine-in',
      tableNumber: 5,
      items: [
        { id: '1', name: 'Margherita Pizza', quantity: 1, station: 'pizza', status: 'preparing' },
        { id: '2', name: 'Caesar Salad', quantity: 2, station: 'salad', status: 'ready' },
        { id: '3', name: 'Garlic Bread', quantity: 1, station: 'pizza', status: 'preparing' }
      ],
      startTime: new Date(Date.now() - 12 * 60000),
      estimatedTime: 18,
      priority: 'high',
      server: 'Alice',
      specialInstructions: 'Extra cheese on pizza'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      type: 'takeout',
      customerName: 'John Smith',
      items: [
        { id: '4', name: 'Grilled Chicken', quantity: 1, station: 'grill', status: 'preparing' },
        { id: '5', name: 'French Fries', quantity: 2, station: 'fryer', status: 'pending' }
      ],
      startTime: new Date(Date.now() - 8 * 60000),
      estimatedTime: 15,
      priority: 'normal',
      server: 'Bob'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      type: 'delivery',
      customerName: 'Sarah Johnson',
      items: [
        { id: '6', name: 'BBQ Burger', quantity: 1, station: 'grill', status: 'pending' },
        { id: '7', name: 'Onion Rings', quantity: 1, station: 'fryer', status: 'pending' },
        { id: '8', name: 'Chocolate Cake', quantity: 1, station: 'dessert', status: 'ready' }
      ],
      startTime: new Date(Date.now() - 5 * 60000),
      estimatedTime: 20,
      priority: 'urgent',
      server: 'Carol'
    }
  ]);

  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const stations = [
    { id: 'all', name: 'All Orders', icon: '🏪' },
    { id: 'grill', name: 'Grill', icon: '🔥' },
    { id: 'salad', name: 'Salad', icon: '🥗' },
    { id: 'fryer', name: 'Fryer', icon: '🍟' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'dessert', name: 'Dessert', icon: '🍰' }
  ];

  const getPriorityColor = (priority: KitchenOrder['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'normal': return 'bg-primary text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getOrderTypeIcon = (type: KitchenOrder['type']) => {
    switch (type) {
      case 'dine-in': return '🍽️';
      case 'takeout': return '🥡';
      case 'delivery': return '🚚';
    }
  };

  const getElapsedTime = (startTime: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 60));
    return elapsed;
  };

  const getProgressPercent = (order: KitchenOrder) => {
    const elapsed = getElapsedTime(order.startTime);
    return Math.min((elapsed / order.estimatedTime) * 100, 100);
  };

  const updateItemStatus = (orderId: string, itemId: string, newStatus: OrderItem['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? {
            ...order,
            items: order.items.map(item => 
              item.id === itemId ? { ...item, status: newStatus } : item
            )
          }
        : order
    ));
  };

  const completeOrder = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const filteredOrders = orders.filter(order => {
    const stationMatch = selectedStation === 'all' || order.items.some(item => item.station === selectedStation);
    const staffMatch = !staffFilter || order.server === staffFilter;
    return stationMatch && staffMatch;
  });

  return (
    <div className="space-y-6">
      {/* Kitchen Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Kitchen Display System</h2>
          <div className="flex items-center space-x-4">
            <p className="text-muted-foreground">Monitor and manage active orders</p>
            {staffFilter && (
              <Badge variant="outline" className="text-sm">
                Staff: {staffFilter}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-sm">
            <Clock className="h-3 w-3 mr-1" />
            {currentTime.toLocaleTimeString()}
          </Badge>
          <Badge variant="secondary">
            {filteredOrders.length} Active Orders
          </Badge>
        </div>
      </div>

      {/* Station Filter */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {stations.map(station => (
          <Button
            key={station.id}
            variant={selectedStation === station.id ? 'default' : 'outline'}
            onClick={() => setSelectedStation(station.id)}
            className="whitespace-nowrap"
            size="sm"
          >
            <span className="mr-2">{station.icon}</span>
            {station.name}
          </Button>
        ))}
      </div>

      {/* Kitchen Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{orders.length}</div>
          <div className="text-sm text-muted-foreground">Active Orders</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">
            {orders.filter(o => getElapsedTime(o.startTime) > o.estimatedTime).length}
          </div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">
            {orders.filter(o => o.priority === 'urgent' || o.priority === 'high').length}
          </div>
          <div className="text-sm text-muted-foreground">High Priority</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {Math.round(orders.reduce((acc, o) => acc + getProgressPercent(o), 0) / orders.length || 0)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Progress</div>
        </Card>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map(order => {
          const elapsed = getElapsedTime(order.startTime);
          const isOverdue = elapsed > order.estimatedTime;
          const progress = getProgressPercent(order);
          
          return (
            <Card key={order.id} className={`p-4 ${isOverdue ? 'border-destructive' : ''}`}>
              <div className="space-y-4">
                {/* Order Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getOrderTypeIcon(order.type)}</span>
                    <div>
                      <div className="font-bold text-sm">{order.orderNumber}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.type === 'dine-in' ? `Table ${order.tableNumber}` : order.customerName}
                      </div>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(order.priority)} variant="secondary">
                    {order.priority.toUpperCase()}
                  </Badge>
                </div>

                {/* Time Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center">
                      <Timer className="h-3 w-3 mr-1" />
                      {elapsed}m / {order.estimatedTime}m
                    </span>
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-2 w-2 mr-1" />
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-2 ${isOverdue ? 'bg-destructive/20' : ''}`}
                  />
                </div>

                {/* Order Items */}
                <ScrollArea className="max-h-40">
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {item.quantity}x {item.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {item.station}
                            </Badge>
                          </div>
                          {item.notes && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {item.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemStatus(order.id, item.id, 'preparing')}
                              className="h-6 px-2"
                            >
                              Start
                            </Button>
                          )}
                          {item.status === 'preparing' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateItemStatus(order.id, item.id, 'ready')}
                              className="h-6 px-2"
                            >
                              Ready
                            </Button>
                          )}
                          {item.status === 'ready' && (
                            <Badge variant="secondary" className="text-xs bg-success text-success-foreground">
                              <CheckCircle className="h-2 w-2 mr-1" />
                              Ready
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Special Instructions */}
                {order.specialInstructions && (
                  <div className="p-2 bg-warning/10 rounded border border-warning/20">
                    <div className="text-xs font-medium text-warning-foreground mb-1">Special Instructions:</div>
                    <div className="text-xs text-muted-foreground">{order.specialInstructions}</div>
                  </div>
                )}

                {/* Server Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    Server: {order.server}
                  </div>
                  
                  {/* Complete Order Button */}
                  {order.items.every(item => item.status === 'ready') && (
                    <Button
                      size="sm"
                      onClick={() => completeOrder(order.id)}
                      className="bg-success hover:bg-success-hover"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No active orders</p>
            <p className="text-sm">All caught up! 🎉</p>
          </div>
        </Card>
      )}
    </div>
  );
};