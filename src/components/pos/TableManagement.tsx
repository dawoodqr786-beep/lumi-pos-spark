import React, { useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, Plus, MapPin, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  customerName?: string;
  orderTotal?: number;
  timeSeated?: Date;
  estimatedDuration?: number;
  server?: string;
}

interface TableManagementProps {
  onOrderStart: (tableId: string) => void;
}

export const TableManagement: React.FC<TableManagementProps> = ({ onOrderStart }) => {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, capacity: 2, status: 'occupied', customerName: 'John Smith', orderTotal: 45.50, timeSeated: new Date(Date.now() - 30 * 60000), server: 'Alice' },
    { id: '2', number: 2, capacity: 4, status: 'available' },
    { id: '3', number: 3, capacity: 6, status: 'reserved', customerName: 'Sarah Johnson', timeSeated: new Date(Date.now() + 30 * 60000) },
    { id: '4', number: 4, capacity: 2, status: 'cleaning' },
    { id: '5', number: 5, capacity: 4, status: 'occupied', customerName: 'Mike Davis', orderTotal: 78.25, timeSeated: new Date(Date.now() - 45 * 60000), server: 'Bob' },
    { id: '6', number: 6, capacity: 8, status: 'available' },
    { id: '7', number: 7, capacity: 2, status: 'available' },
    { id: '8', number: 8, capacity: 4, status: 'occupied', customerName: 'Lisa Brown', orderTotal: 32.75, timeSeated: new Date(Date.now() - 15 * 60000), server: 'Alice' },
  ]);

  const [newReservation, setNewReservation] = useState({
    customerName: '',
    partySize: 2,
    time: '',
  });

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'occupied': return 'bg-destructive text-destructive-foreground';
      case 'reserved': return 'bg-warning text-warning-foreground';
      case 'cleaning': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4" />;
      case 'occupied': return <Users className="h-4 w-4" />;
      case 'reserved': return <Clock className="h-4 w-4" />;
      case 'cleaning': return <XCircle className="h-4 w-4" />;
    }
  };

  const formatTimeSeated = (time: Date) => {
    const now = new Date();
    const diff = Math.abs(now.getTime() - time.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    return time > now ? `in ${minutes}m` : `${minutes}m ago`;
  };

  const handleSeatCustomer = (tableId: string) => {
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { ...table, status: 'occupied', timeSeated: new Date() }
        : table
    ));
  };

  const handleTableAction = (tableId: string, action: 'clean' | 'free' | 'order') => {
    if (action === 'order') {
      onOrderStart(tableId);
      return;
    }
    
    setTables(prev => prev.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            status: action === 'clean' ? 'cleaning' : 'available',
            ...(action === 'free' && { customerName: undefined, orderTotal: undefined, timeSeated: undefined, server: undefined })
          }
        : table
    ));
  };

  return (
    <div className="space-y-6">
      {/* Table Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Table Management</h2>
          <p className="text-muted-foreground">Manage restaurant seating and reservations</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Make Reservation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Customer Name"
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, customerName: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Party Size"
                  value={newReservation.partySize}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, partySize: parseInt(e.target.value) }))}
                />
                <Input
                  type="datetime-local"
                  value={newReservation.time}
                  onChange={(e) => setNewReservation(prev => ({ ...prev, time: e.target.value }))}
                />
                <Button className="w-full">Confirm Reservation</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{tables.filter(t => t.status === 'available').length}</div>
          <div className="text-sm text-muted-foreground">Available</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{tables.filter(t => t.status === 'occupied').length}</div>
          <div className="text-sm text-muted-foreground">Occupied</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{tables.filter(t => t.status === 'reserved').length}</div>
          <div className="text-sm text-muted-foreground">Reserved</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-secondary-foreground">{tables.filter(t => t.status === 'cleaning').length}</div>
          <div className="text-sm text-muted-foreground">Cleaning</div>
        </Card>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map(table => (
          <Card key={table.id} className="p-4 relative">
            <div className="space-y-3">
              {/* Table Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    {table.number}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {table.capacity} seats
                  </span>
                </div>
                <Badge className={getStatusColor(table.status)} variant="secondary">
                  {getStatusIcon(table.status)}
                  <span className="ml-1 capitalize">{table.status}</span>
                </Badge>
              </div>

              {/* Table Details */}
              {table.status === 'occupied' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{table.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">Server: {table.server}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Seated {table.timeSeated && formatTimeSeated(table.timeSeated)}
                    </span>
                    {table.orderTotal && (
                      <span className="text-sm font-bold text-primary">
                        ${table.orderTotal.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {table.status === 'reserved' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{table.customerName}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Reserved {table.timeSeated && formatTimeSeated(table.timeSeated)}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {table.status === 'available' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSeatCustomer(table.id)}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    Seat Customer
                  </Button>
                )}

                {table.status === 'occupied' && (
                  <div className="space-y-1">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={() => handleTableAction(table.id, 'order')}
                    >
                      Take Order
                    </Button>
                    <div className="grid grid-cols-2 gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTableAction(table.id, 'free')}
                      >
                        Check Out
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTableAction(table.id, 'clean')}
                      >
                        Clean
                      </Button>
                    </div>
                  </div>
                )}

                {table.status === 'reserved' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleSeatCustomer(table.id)}
                  >
                    Seat Now
                  </Button>
                )}

                {table.status === 'cleaning' && (
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleTableAction(table.id, 'free')}
                  >
                    Mark Clean
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};