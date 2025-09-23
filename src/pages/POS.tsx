import React, { useState } from 'react';
import { ShoppingCart, Search, Scan, CreditCard, Banknote, Smartphone, User, Receipt, Plus, Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Handle checkout logic
    console.log('Processing checkout...', { cart, customerInfo, paymentMethod, total });
    // Reset cart after successful checkout
    setCart([]);
    setCustomerInfo({ name: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Product Selection Area */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">LumiMart POS</h1>
              <p className="text-muted-foreground">Point of Sale System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-success text-success-foreground">
              Store Open
            </Badge>
            <Badge variant="outline">Cashier: John Doe</Badge>
          </div>
        </div>

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
        <div className="flex space-x-3 overflow-x-auto pb-2">
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

      {/* Cart and Checkout Area */}
      <div className="w-96 bg-pos-cart border-l border-border flex flex-col">
        {/* Cart Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <Badge variant="secondary">{cart.length} items</Badge>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center space-x-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Customer</span>
          </div>
          <Input
            placeholder="Customer name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder="Phone number"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            cart.map(item => (
              <Card key={item.id} className="p-3">
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
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Totals and Payment */}
        {cart.length > 0 && (
          <div className="border-t border-border p-6 space-y-6">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
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
            <div className="space-y-3">
              <span className="text-sm font-medium">Payment Method</span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="p-3 h-auto flex-col space-y-1"
                >
                  <Banknote className="h-4 w-4" />
                  <span className="text-xs">Cash</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="p-3 h-auto flex-col space-y-1"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-xs">Card</span>
                </Button>
                <Button
                  variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('digital')}
                  className="p-3 h-auto flex-col space-y-1"
                >
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">Digital</span>
                </Button>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleCheckout}
                className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary-hover"
              >
                <Receipt className="h-5 w-5 mr-2" />
                Complete Sale
              </Button>
              <Button
                variant="outline"
                onClick={() => setCart([])}
                className="w-full"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POS;