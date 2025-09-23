import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, BarChart3, Package, Users, ArrowRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">LumiMart</h1>
                <p className="text-sm text-muted-foreground">Smart Supermarket Management</p>
              </div>
            </div>
            <Link to="/pos">
              <Button className="bg-primary hover:bg-primary-hover">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Open POS
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Revolutionize Your Supermarket Operations
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All-in-one platform to track inventory, process sales, and grow your business with real-time insights.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mx-auto mb-3">
              <Package className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-muted-foreground">Inventory Items</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-success/10 text-success p-3 rounded-lg w-fit mx-auto mb-3">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="text-sm text-muted-foreground">Sales Today</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit mx-auto mb-3">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">+23%</div>
            <div className="text-sm text-muted-foreground">Revenue Growth</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="bg-warning/10 text-warning p-3 rounded-lg w-fit mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Active Staff</div>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="text-center">
          <Link to="/pos">
            <Button size="lg" className="bg-primary hover:bg-primary-hover text-lg px-8 py-4 h-auto">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Launch Enhanced POS System
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            Experience the enhanced Point of Sale interface with modern features
          </p>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6">
            <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Enhanced POS Interface</h3>
            <p className="text-muted-foreground mb-4">
              Touch-friendly design with barcode scanning, multiple payment methods, and real-time inventory updates.
            </p>
            <Link to="/pos">
              <Button variant="outline" size="sm">
                Try POS <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="bg-success/10 text-success p-3 rounded-lg w-fit mb-4">
              <Package className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Inventory</h3>
            <p className="text-muted-foreground mb-4">
              Automated stock tracking with low-stock alerts and supplier integration.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </Card>

          <Card className="p-6">
            <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Business Analytics</h3>
            <p className="text-muted-foreground mb-4">
              Real-time sales reports, revenue tracking, and performance insights.
            </p>
            <Badge variant="secondary">Coming Soon</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
