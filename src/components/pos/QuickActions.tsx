import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Percent, 
  Gift, 
  CreditCard, 
  DollarSign, 
  User, 
  ShoppingBag,
  Zap,
  Tag
} from 'lucide-react';

interface QuickActionsProps {
  onApplyDiscount: (discount: number) => void;
  onAddCustomer: () => void;
  cartTotal: number;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onApplyDiscount, 
  onAddCustomer, 
  cartTotal 
}) => {
  const [discountAmount, setDiscountAmount] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');

  const quickDiscounts = [5, 10, 15, 20];
  const loyaltyCustomers = ['John Smith', 'Sarah Johnson', 'Mike Wilson'];

  const handleQuickDiscount = (percent: number) => {
    onApplyDiscount(percent);
  };

  const handleCustomDiscount = () => {
    const discount = parseFloat(discountAmount);
    if (!isNaN(discount) && discount > 0) {
      onApplyDiscount(discount);
      setDiscountAmount('');
    }
  };

  const calculatorButtons = [
    'C', '±', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=', '='
  ];

  const handleCalculatorClick = (value: string) => {
    switch (value) {
      case 'C':
        setCalculatorValue('0');
        break;
      case '=':
        try {
          const result = eval(calculatorValue.replace('×', '*').replace('÷', '/'));
          setCalculatorValue(result.toString());
        } catch {
          setCalculatorValue('Error');
        }
        break;
      default:
        setCalculatorValue(prev => prev === '0' ? value : prev + value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Discounts */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <Percent className="h-4 w-4 mr-2 text-primary" />
            Quick Discounts
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {quickDiscounts.map(discount => (
            <Button
              key={discount}
              variant="outline"
              size="sm"
              onClick={() => handleQuickDiscount(discount)}
              className="h-8"
            >
              {discount}% OFF
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            placeholder="Custom %"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="h-8"
            type="number"
          />
          <Button onClick={handleCustomDiscount} size="sm" className="h-8">
            Apply
          </Button>
        </div>
      </Card>

      {/* Loyalty Customers */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-2 text-secondary" />
            Loyalty Customers
          </h3>
        </div>
        <div className="space-y-2">
          {loyaltyCustomers.map(customer => (
            <Button
              key={customer}
              variant="ghost"
              size="sm"
              onClick={onAddCustomer}
              className="w-full justify-start h-8 text-xs"
            >
              <div className="flex items-center justify-between w-full">
                <span>{customer}</span>
                <Badge variant="secondary" className="text-xs">VIP</Badge>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {/* Quick Payment Methods */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-warning" />
            Quick Pay
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-10 flex-col">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs">Exact Cash</span>
          </Button>
          <Button variant="outline" size="sm" className="h-10 flex-col">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Card</span>
          </Button>
        </div>
      </Card>

      {/* Mini Calculator */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <Calculator className="h-4 w-4 mr-2 text-success" />
            Calculator
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
          >
            {isCalculatorOpen ? 'Hide' : 'Show'}
          </Button>
        </div>
        {isCalculatorOpen && (
          <div className="space-y-2">
            <div className="bg-muted p-2 rounded text-right font-mono text-sm">
              {calculatorValue}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {calculatorButtons.map((btn, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCalculatorClick(btn)}
                  className={`h-8 text-xs ${
                    btn === '=' ? 'col-span-1' : ''
                  } ${
                    ['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn) 
                      ? 'bg-primary/5' : ''
                  }`}
                >
                  {btn}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <ShoppingBag className="h-4 w-4 mr-2 text-primary" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <Gift className="h-3 w-3 mr-2" />
            Add Gift Card
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <Tag className="h-3 w-3 mr-2" />
            Apply Coupon
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start h-8">
            <User className="h-3 w-3 mr-2" />
            New Customer
          </Button>
        </div>
      </Card>

      {/* Cash Management */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-3">Cash Drawer</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Open Drawer
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            Count Cash
          </Button>
        </div>
        <div className="mt-2 text-center">
          <Badge variant="secondary" className="text-xs">
            Balance: $1,247.50
          </Badge>
        </div>
      </Card>
    </div>
  );
};