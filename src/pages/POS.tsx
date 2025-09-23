import React, { useState } from 'react';
import { ShoppingCart, Search, Scan, CreditCard, Banknote, Smartphone, User, Receipt, Plus, Minus, X, Store, Bell, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DashboardWidgets } from '@/components/pos/DashboardWidgets';
import { TransactionHistory } from '@/components/pos/TransactionHistory';
import { QuickActions } from '@/components/pos/QuickActions';

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
  const [activeView, setActiveView] = useState<'pos' | 'dashboard'>('dashboard');
  const [discount, setDiscount] = useState(0);
  const [completedTransactions, setCompletedTransactions] = useState(0);

  // Sample products data
  const products: Product[] = [
    { id: '1', name: 'Apple iPhone 15', price: 999.99, barcode: '1234567890123', category: 'electronics', stock: 15 },
    { id: '2', name: 'Organic Bananas', price: 2.49, barcode: '1234567890124', category: 'produce', stock: 50 },
    { id: '3', name: 'Coca-Cola 2L', price: 3.99, barcode: '1234567890125', category: 'beverages', stock: 30 },
    { id: '4', name: 'Bread Loaf', price: 2.99, barcode: '1234567890126', category: 'bakery', stock: 25 },
    { id: '5', name: 'Milk 1L', price: 4.99, barcode: '1234567890127', category: 'dairy', stock: 40 },
    { id: '6', name: 'Samsung TV 55"', price: 799.99, barcode: '1234567890128', category: 'electronics', stock: 8 },
  ];

  const categories = [
    { id: 'all', name: 'All Items', color: 'bg-secondary' },
    { id: 'electronics', name: 'Electronics', color: 'bg-primary' },
    { id: 'produce', name: 'Produce', color: 'bg-success' },
    { id: 'beverages', name: 'Beverages', color: 'bg-warning' },
    { id: 'bakery', name: 'Bakery', color: 'bg-destructive' },
    { id: 'dairy', name: 'Dairy', color: 'bg-secondary' },
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
          
          <div className="flex items-center space-x-3">
            <Button
              variant={activeView === 'dashboard' ? 'default' : 'outline'}
              onClick={() => setActiveView('dashboard')}
              size="sm"
            >
              Dashboard
            </Button>
            <Button
              variant={activeView === 'pos' ? 'default' : 'outline'}
              onClick={() => setActiveView('pos')}
              size="sm"
            >
              POS
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
                  <h3 className="text-lg font-semibold mb-4">Sales Chart</h3>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    Sales chart visualization would go here
                  </div>
                </Card>
              </div>
            </div>
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
                        <span className="text-2xl">{product.category === 'electronics' ? '📱' : 
                          product.category === 'produce' ? '🍎' : 
                          product.category === 'beverages' ? '🥤' : 
                          product.category === 'bakery' ? '🍞' : '🥛'}</span>
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

        {/* Right Sidebar - Cart and Quick Actions */}
        <div className="w-96 bg-pos-cart border-l border-border flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Shopping Cart</h2>
              <Badge variant="secondary">{cart.length} items</Badge>
            </div>
          </div>

          {/* Customer Info */}
          <div className="p-3 border-b border-border space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Customer</span>
            </div>
            <Input
              placeholder="Customer name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
              className="h-8"
            />
            <Input
              placeholder="Phone number"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
              className="h-8"
            />
          </div>

          {/* Cart Items */}
          <ScrollArea className="flex-1 p-3">
            {cart.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <Card key={item.id} className="p-2">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-sm">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Totals and Payment */}
          {cart.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount ({discount}%):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-pos-total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <span className="text-sm font-medium">Payment Method</span>
                <div className="grid grid-cols-3 gap-1">
                  <Button
                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('cash')}
                    className="p-2 h-auto flex-col space-y-1"
                    size="sm"
                  >
                    <Banknote className="h-3 w-3" />
                    <span className="text-xs">Cash</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('card')}
                    className="p-2 h-auto flex-col space-y-1"
                    size="sm"
                  >
                    <CreditCard className="h-3 w-3" />
                    <span className="text-xs">Card</span>
                  </Button>
                  <Button
                    variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                    onClick={() => setPaymentMethod('digital')}
                    className="p-2 h-auto flex-col space-y-1"
                    size="sm"
                  >
                    <Smartphone className="h-3 w-3" />
                    <span className="text-xs">Digital</span>
                  </Button>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-10 font-semibold bg-primary hover:bg-primary-hover"
                  size="sm"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Complete Sale
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {setCart([]); setDiscount(0);}}
                  className="w-full"
                  size="sm"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}

          {/* Quick Actions Sidebar */}
          <div className="p-3 border-t border-border overflow-y-auto max-h-96">
            <QuickActions 
              onApplyDiscount={handleApplyDiscount}
              onAddCustomer={handleAddCustomer}
              cartTotal={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;