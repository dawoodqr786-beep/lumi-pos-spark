import React, { useState } from 'react';
import { ShoppingCart, Search, Scan, CreditCard, Banknote, Smartphone, User, Receipt, Plus, Minus, X, Store, Bell, Settings, Menu, UtensilsCrossed, ChefHat, Users, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardWidgets } from '@/components/pos/DashboardWidgets';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { QuickActions } from '@/components/pos/QuickActions';
import { TableManagement } from '@/components/pos/TableManagement';
import { KitchenDisplay } from '@/components/pos/KitchenDisplay';
import { OrderTypeSelector } from '@/components/pos/OrderTypeSelector';
import { StaffWorkflow } from '@/components/pos/StaffWorkflow';
import { EnhancedCart } from '@/components/pos/EnhancedCart';

interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  stock: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('cash');
  const [activeView, setActiveView] = useState<'dashboard' | 'pos' | 'tables' | 'kitchen' | 'staff' | 'order-type'>('dashboard');
  const [discount, setDiscount] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [orderTypeData, setOrderTypeData] = useState<any>(null);

  // Restaurant menu items
  const products: Product[] = [
    { id: '1', name: 'Margherita Pizza', price: 16.99, barcode: '1234567890123', category: 'pizza', stock: 25 },
    { id: '2', name: 'Caesar Salad', price: 12.49, barcode: '1234567890124', category: 'salads', stock: 30 },
    { id: '3', name: 'Grilled Chicken', price: 18.99, barcode: '1234567890125', category: 'mains', stock: 20 },
    { id: '4', name: 'Fish & Chips', price: 15.99, barcode: '1234567890126', category: 'mains', stock: 18 },
    { id: '5', name: 'Chocolate Cake', price: 7.99, barcode: '1234567890127', category: 'desserts', stock: 15 },
    { id: '6', name: 'Coca-Cola', price: 3.99, barcode: '1234567890128', category: 'beverages', stock: 50 },
    { id: '7', name: 'BBQ Burger', price: 14.99, barcode: '1234567890129', category: 'burgers', stock: 22 },
    { id: '8', name: 'Pasta Carbonara', price: 16.49, barcode: '1234567890130', category: 'pasta', stock: 20 },
    { id: '9', name: 'French Fries', price: 5.99, barcode: '1234567890131', category: 'sides', stock: 40 },
    { id: '10', name: 'Tiramisu', price: 8.99, barcode: '1234567890132', category: 'desserts', stock: 12 }
  ];

  const categories = [
    { id: 'all', name: 'All Items', color: 'bg-secondary' },
    { id: 'pizza', name: 'Pizza', color: 'bg-primary' },
    { id: 'burgers', name: 'Burgers', color: 'bg-success' },
    { id: 'mains', name: 'Main Courses', color: 'bg-warning' },
    { id: 'salads', name: 'Salads', color: 'bg-destructive' },
    { id: 'pasta', name: 'Pasta', color: 'bg-secondary' },
    { id: 'sides', name: 'Sides', color: 'bg-muted' },
    { id: 'beverages', name: 'Beverages', color: 'bg-primary' },
    { id: 'desserts', name: 'Desserts', color: 'bg-success' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.08; // 8% tax
  const total = discountedSubtotal + tax;
  
  // Calculate total sales for dashboard
  const totalSales = completedTransactions * 45.67; // Mock calculation

  const handleCheckout = () => {
    // Handle checkout logic
    console.log('Processing checkout...', { cart, customerInfo, paymentMethod, total });
    // Reset cart after successful checkout
    setCart([]);
    setCustomerInfo({ name: '', phone: '' });
    setDiscount(0);
    setCompletedTransactions(prev => prev + 1);
  };

  const handleApplyDiscount = (discountPercent: number) => {
    setDiscount(discountPercent);
  };

  const handleAddCustomer = () => {
    console.log('Adding customer...');
  };

  const handleOrderStart = (tableId: string) => {
    setSelectedTableId(tableId);
    setActiveView('order-type');
  };

  const handleViewSwitch = (view: string) => {
    setActiveView(view as any);
  };

  const handleOrderTypeSelect = (orderData: any) => {
    setOrderTypeData(orderData);
    setActiveView('pos');
  };

  const handleBackToTables = () => {
    setActiveView('tables');
    setSelectedTableId(null);
    setOrderTypeData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="bg-pos-header border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">LumiMart POS</h1>
              <p className="text-sm text-muted-foreground">Advanced Point of Sale System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              size="sm"
            >
              <Store className="h-3 w-3 mr-1" />
              Dashboard
            </Button>
            <Button
              variant={activeView === 'tables' ? 'default' : 'outline'}
              onClick={() => setActiveView('tables')}
              size="sm"
            >
              <UtensilsCrossed className="h-3 w-3 mr-1" />
              Tables
            </Button>
            <Button
              variant={activeView === 'kitchen' ? 'default' : 'outline'}
              onClick={() => setActiveView('kitchen')}
              size="sm"
            >
              <ChefHat className="h-3 w-3 mr-1" />
              Kitchen
            </Button>
            <Button
              variant={activeView === 'staff' ? 'default' : 'outline'}
              onClick={() => setActiveView('staff')}
              size="sm"
            >
              <Users className="h-3 w-3 mr-1" />
              Staff
            </Button>
            <Button
              variant={activeView === 'pos' ? 'default' : 'outline'}
              onClick={() => setActiveView('pos')}
              size="sm"
            >
              <ClipboardList className="h-3 w-3 mr-1" />
              Orders
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Badge variant="secondary" className="bg-success text-success-foreground">
                Store Open
              </Badge>
              <Badge variant="outline">Cashier: John Doe</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {activeView === 'dashboard' ? (
            <div className="space-y-6">
              {/* Dashboard Widgets */}
              <DashboardWidgets 
                totalSales={totalSales} 
                transactionCount={completedTransactions} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TransactionHistory />
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Restaurant Analytics</h3>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    Restaurant analytics visualization would go here
                  </div>
                </Card>
              </div>
            </div>
          ) : activeView === 'tables' ? (
            <TableManagement onOrderStart={handleOrderStart} onViewSwitch={handleViewSwitch} />
          ) : activeView === 'kitchen' ? (
            <KitchenDisplay staffFilter={undefined} />
          ) : activeView === 'staff' ? (
            <StaffWorkflow />
          ) : activeView === 'order-type' ? (
            <OrderTypeSelector 
              onOrderTypeSelect={handleOrderTypeSelect}
              onBack={handleBackToTables}
            />
          ) : (
            <div className="space-y-6">{/* POS Interface */}

              {/* Search and Scanner */}
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products or scan barcode..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button size="lg" variant="outline" className="h-12 px-6">
                  <Scan className="h-5 w-5 mr-2" />
                  Scan
                </Button>
              </div>

              {/* Category Filter */}
              <ScrollArea className="w-full">
                <div className="flex space-x-3 pb-2">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <Card
                    key={product.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 group"
                    onClick={() => addToCart(product)}
                  >
                    <div className="space-y-3">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-3xl">
                          {product.category === 'pizza' ? '🍕' : 
                          product.category === 'burgers' ? '🍔' : 
                          product.category === 'mains' ? '🍗' : 
                          product.category === 'salads' ? '🥗' : 
                          product.category === 'pasta' ? '🍝' : 
                          product.category === 'sides' ? '🍟' : 
                          product.category === 'beverages' ? '🥤' : 
                          product.category === 'desserts' ? '🍰' : '🍽️'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Enhanced Cart Sidebar */}
        <EnhancedCart
          cart={cart}
          customerInfo={customerInfo}
          paymentMethod={paymentMethod}
          discount={discount}
          subtotal={subtotal}
          tax={tax}
          total={total}
          selectedTable={selectedTableId ? { id: selectedTableId, number: parseInt(selectedTableId), server: 'Alice' } : undefined}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCustomerInfoChange={setCustomerInfo}
          onPaymentMethodChange={setPaymentMethod}
          onApplyDiscount={handleApplyDiscount}
          onCheckout={handleCheckout}
          onAddNote={(itemId, note) => {
            // Handle adding notes to items
            console.log('Adding note to item:', itemId, note);
          }}
        />
      </div>
    </div>
  );
  );
export default POS;