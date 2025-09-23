import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Receipt, Eye, RefreshCw } from 'lucide-react';

interface Transaction {
  id: string;
  timestamp: string;
  total: number;
  items: number;
  customer: string;
  paymentMethod: 'cash' | 'card' | 'digital';
  status: 'completed' | 'refunded' | 'pending';
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    timestamp: '2 min ago',
    total: 45.99,
    items: 3,
    customer: 'John Smith',
    paymentMethod: 'card',
    status: 'completed'
  },
  {
    id: 'TXN-002',
    timestamp: '5 min ago',
    total: 127.85,
    items: 8,
    customer: 'Sarah Johnson',
    paymentMethod: 'digital',
    status: 'completed'
  },
  {
    id: 'TXN-003',
    timestamp: '12 min ago',
    total: 23.50,
    items: 2,
    customer: 'Guest Customer',
    paymentMethod: 'cash',
    status: 'completed'
  },
  {
    id: 'TXN-004',
    timestamp: '18 min ago',
    total: 89.99,
    items: 4,
    customer: 'Mike Wilson',
    paymentMethod: 'card',
    status: 'refunded'
  },
  {
    id: 'TXN-005',
    timestamp: '25 min ago',
    total: 156.75,
    items: 12,
    customer: 'Emma Davis',
    paymentMethod: 'card',
    status: 'completed'
  }
];

export const TransactionHistory: React.FC = () => {
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'refunded':
        return <Badge variant="destructive">Refunded</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentIcon = (method: Transaction['paymentMethod']) => {
    switch (method) {
      case 'cash':
        return '💵';
      case 'card':
        return '💳';
      case 'digital':
        return '📱';
      default:
        return '💳';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <ScrollArea className="h-80">
        <div className="space-y-3">
          {mockTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Receipt className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{transaction.id}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-muted-foreground">{transaction.customer}</p>
                      <span className="text-xs">•</span>
                      <p className="text-xs text-muted-foreground">{transaction.items} items</p>
                      <span className="text-xs">•</span>
                      <p className="text-xs text-muted-foreground">{transaction.timestamp}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="font-bold text-pos-total">${transaction.total.toFixed(2)}</p>
                    <div className="flex items-center justify-end space-x-1">
                      <span className="text-xs">{getPaymentIcon(transaction.paymentMethod)}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {transaction.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
      
      <div className="mt-4 pt-4 border-t border-border">
        <Button variant="outline" className="w-full">
          View All Transactions
        </Button>
      </div>
    </Card>
  );
};