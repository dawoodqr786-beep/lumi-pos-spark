import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Clock, 
  AlertTriangle,
  Star,
  BarChart3
} from 'lucide-react';

interface DashboardWidgetsProps {
  totalSales: number;
  transactionCount: number;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ 
  totalSales, 
  transactionCount 
}) => {
  const salesData = {
    today: totalSales,
    yesterday: 8450.32,
    thisWeek: 42150.75,
    thisMonth: 156789.45
  };

  const growthRate = ((salesData.today - salesData.yesterday) / salesData.yesterday * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Today's Sales */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Today's Sales</p>
            <p className="text-2xl font-bold text-pos-total">${salesData.today.toFixed(2)}</p>
          </div>
          <div className="bg-success/10 p-2 rounded-lg">
            <DollarSign className="h-5 w-5 text-success" />
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          {growthRate >= 0 ? (
            <TrendingUp className="h-3 w-3 text-success mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive mr-1" />
          )}
          <span className={growthRate >= 0 ? "text-success" : "text-destructive"}>
            {Math.abs(growthRate).toFixed(1)}%
          </span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      </Card>

      {/* Transactions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{transactionCount}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <TrendingUp className="h-3 w-3 text-success mr-1" />
          <span className="text-success">+12%</span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      </Card>

      {/* Average Order */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Order</p>
            <p className="text-2xl font-bold">
              ${transactionCount > 0 ? (salesData.today / transactionCount).toFixed(2) : '0.00'}
            </p>
          </div>
          <div className="bg-secondary/10 p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-secondary" />
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <TrendingUp className="h-3 w-3 text-success mr-1" />
          <span className="text-success">+8%</span>
          <span className="text-muted-foreground ml-1">vs yesterday</span>
        </div>
      </Card>

      {/* Active Customers */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Customers</p>
            <p className="text-2xl font-bold">847</p>
          </div>
          <div className="bg-warning/10 p-2 rounded-lg">
            <Users className="h-5 w-5 text-warning" />
          </div>
        </div>
        <div className="flex items-center mt-2 text-sm">
          <TrendingUp className="h-3 w-3 text-success mr-1" />
          <span className="text-success">+15%</span>
          <span className="text-muted-foreground ml-1">this week</span>
        </div>
      </Card>

      {/* Inventory Status */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Inventory Status</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Total Products</span>
            <Badge variant="secondary">2,847</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Low Stock</span>
            <Badge variant="destructive">23</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Out of Stock</span>
            <Badge variant="outline">7</Badge>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 md:col-span-2">
        <h3 className="text-sm font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <Package className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Users className="h-4 w-4 mr-2" />
            New Customer
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales Report
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Clock className="h-4 w-4 mr-2" />
            End of Day
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4 md:col-span-2 lg:col-span-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Recent Activity</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-success/10 p-1 rounded">
                <ShoppingCart className="h-3 w-3 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium">Sale completed</p>
                <p className="text-xs text-muted-foreground">Transaction #12045</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">$45.99</p>
              <p className="text-xs text-muted-foreground">2 min ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-warning/10 p-1 rounded">
                <AlertTriangle className="h-3 w-3 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium">Low stock alert</p>
                <p className="text-xs text-muted-foreground">Apple iPhone 15</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">3 left</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-1 rounded">
                <Users className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">New customer registered</p>
                <p className="text-xs text-muted-foreground">Sarah Johnson</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">5 min ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Top Selling Products</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Coca-Cola 2L', sales: 156, revenue: 623.44 },
            { name: 'Bread Loaf', sales: 98, revenue: 293.02 },
            { name: 'Milk 1L', sales: 87, revenue: 434.13 },
          ].map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-secondary/10 p-1 rounded text-xs font-medium w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                </div>
              </div>
              <p className="text-sm font-medium">${product.revenue}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-4 md:col-span-2">
        <h3 className="text-sm font-medium mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Sales Target</span>
              <span>78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Customer Satisfaction</span>
              <span>94%</span>
            </div>
            <Progress value={94} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Inventory Turnover</span>
              <span>67%</span>
            </div>
            <Progress value={67} className="h-2" />
          </div>
        </div>
      </Card>
    </div>
  );
};