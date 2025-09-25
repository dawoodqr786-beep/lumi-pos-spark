import React from 'react';
import { ShoppingCart, Plus, Minus, X, User, Receipt, CreditCard, Banknote, Smartphone, Percent, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  notes?: string;
}

interface EnhancedCartProps {
  cart: CartItem[];
  customerInfo: { name: string; phone: string };
  paymentMethod: 'cash' | 'card' | 'digital';
  discount: number;
  subtotal: number;
  tax: number;
  total: number;
  selectedTable?: { id: string; number: number; server?: string };
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCustomerInfoChange: (info: { name: string; phone: string }) => void;
  onPaymentMethodChange: (method: 'cash' | 'card' | 'digital') => void;
  onApplyDiscount: (discount: number) => void;
  onCheckout: () => void;
  onAddNote: (itemId: string, note: string) => void;
}

export const EnhancedCart: React.FC<EnhancedCartProps> = ({
  cart,
  customerInfo,
  paymentMethod,
  discount,
  subtotal,
  tax,
  total,
  selectedTable,
  onUpdateQuantity,
  onRemoveItem,
  onCustomerInfoChange,
  onPaymentMethodChange,
  onApplyDiscount,
  onCheckout,
  onAddNote
}) => {
  const discountAmount = (subtotal * discount) / 100;
  const discountedSubtotal = subtotal - discountAmount;

  return (
    <div className="w-96 bg-card border-l border-border flex flex-col shadow-lg">
      {/* Cart Header */}
      <div className="p-4 border-b border-border bg-primary/5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-primary">Current Order</h2>
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {cart.length} items
          </Badge>
        </div>
        
        {/* Table Information */}
        {selectedTable && (
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Table {selectedTable.number}</span>
            {selectedTable.server && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">Server: {selectedTable.server}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Customer Details</span>
        </div>
        <div className="space-y-2">
          <Input
            placeholder="Customer name"
            value={customerInfo.name}
            onChange={(e) => onCustomerInfoChange({ ...customerInfo, name: e.target.value })}
            className="h-8 bg-background"
          />
          <Input
            placeholder="Phone number"
            value={customerInfo.phone}
            onChange={(e) => onCustomerInfoChange({ ...customerInfo, phone: e.target.value })}
            className="h-8 bg-background"
          />
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 p-3">
        {cart.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Cart is empty</p>
            <p className="text-sm">Add items to start an order</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <Card key={item.id} className="p-3 bg-card border border-border/50 hover:border-primary/20 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-primary truncate">{item.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                        <Badge variant="outline" className="text-xs h-4">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-7 w-7 p-0 border-primary/20"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div className="min-w-[3rem] text-center">
                        <span className="text-sm font-bold bg-primary/10 px-2 py-1 rounded">
                          {item.quantity}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 p-0 border-primary/20"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Item Notes */}
                  {item.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded border-l-2 border-primary/30">
                      <span className="font-medium">Note:</span> {item.notes}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t border-border bg-muted/20">
          {/* Quick Discount */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Percent className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Quick Discount</span>
            </div>
            <div className="flex space-x-1">
              {[5, 10, 15, 20].map(discountPercent => (
                <Button
                  key={discountPercent}
                  size="sm"
                  variant={discount === discountPercent ? "default" : "outline"}
                  onClick={() => onApplyDiscount(discountPercent)}
                  className="flex-1 h-7 text-xs"
                >
                  {discountPercent}%
                </Button>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-3 border-b border-border space-y-2">
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
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-3 border-b border-border">
            <div className="flex items-center space-x-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Payment Method</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              <Button
                size="sm"
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                onClick={() => onPaymentMethodChange('cash')}
                className="h-8"
              >
                <Banknote className="h-3 w-3 mr-1" />
                Cash
              </Button>
              <Button
                size="sm"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => onPaymentMethodChange('card')}
                className="h-8"
              >
                <CreditCard className="h-3 w-3 mr-1" />
                Card
              </Button>
              <Button
                size="sm"
                variant={paymentMethod === 'digital' ? 'default' : 'outline'}
                onClick={() => onPaymentMethodChange('digital')}
                className="h-8"
              >
                <Smartphone className="h-3 w-3 mr-1" />
                Digital
              </Button>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="p-3">
            <Button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md"
            >
              <Receipt className="h-5 w-5 mr-2" />
              Complete Order
            </Button>
            <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Order will be sent to kitchen
            </div>
          </div>
        </div>
      )}
    </div>
  );
};