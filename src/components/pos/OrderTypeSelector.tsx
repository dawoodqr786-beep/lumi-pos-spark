import React, { useState } from 'react';
import { ShoppingBag, Utensils, Truck, Clock, MapPin, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderTypeData {
  type: 'dine-in' | 'takeout' | 'delivery';
  tableNumber?: number;
  customerName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  estimatedTime?: number;
  specialInstructions?: string;
}

interface OrderTypeSelectorProps {
  onOrderTypeSelect: (orderData: OrderTypeData) => void;
  onBack: () => void;
}

export const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({ 
  onOrderTypeSelect, 
  onBack 
}) => {
  const [selectedType, setSelectedType] = useState<'dine-in' | 'takeout' | 'delivery' | null>(null);
  const [orderData, setOrderData] = useState<OrderTypeData>({
    type: 'dine-in',
    customerName: '',
    phoneNumber: '',
    deliveryAddress: '',
    estimatedTime: 15,
    specialInstructions: ''
  });

  const orderTypes = [
    {
      type: 'dine-in' as const,
      title: 'Dine In',
      description: 'Customer dining at restaurant',
      icon: <Utensils className="h-8 w-8" />,
      color: 'bg-primary text-primary-foreground',
      estimatedTime: '15-25 min'
    },
    {
      type: 'takeout' as const,
      title: 'Takeout',
      description: 'Customer pickup order',
      icon: <ShoppingBag className="h-8 w-8" />,
      color: 'bg-success text-success-foreground',
      estimatedTime: '10-20 min'
    },
    {
      type: 'delivery' as const,
      title: 'Delivery',
      description: 'Deliver to customer address',
      icon: <Truck className="h-8 w-8" />,
      color: 'bg-warning text-warning-foreground',
      estimatedTime: '25-45 min'
    }
  ];

  const handleTypeSelect = (type: 'dine-in' | 'takeout' | 'delivery') => {
    setSelectedType(type);
    setOrderData(prev => ({ 
      ...prev, 
      type,
      estimatedTime: type === 'dine-in' ? 20 : type === 'takeout' ? 15 : 35
    }));
  };

  const handleProceed = () => {
    onOrderTypeSelect(orderData);
  };

  const isFormValid = () => {
    if (!selectedType) return false;
    
    switch (selectedType) {
      case 'dine-in':
        return orderData.tableNumber !== undefined;
      case 'takeout':
        return orderData.customerName && orderData.phoneNumber;
      case 'delivery':
        return orderData.customerName && orderData.phoneNumber && orderData.deliveryAddress;
      default:
        return false;
    }
  };

  if (!selectedType) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary mb-2">Select Order Type</h2>
          <p className="text-muted-foreground">How will this order be fulfilled?</p>
        </div>

        {/* Order Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {orderTypes.map((type) => (
            <Card
              key={type.type}
              className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group"
              onClick={() => handleTypeSelect(type.type)}
            >
              <div className="text-center space-y-4">
                <div className={`${type.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                  {type.icon}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{type.estimatedTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button variant="outline" onClick={onBack}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Order Details</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Badge className={orderTypes.find(t => t.type === selectedType)?.color}>
              {orderTypes.find(t => t.type === selectedType)?.icon}
              <span className="ml-2">{orderTypes.find(t => t.type === selectedType)?.title}</span>
            </Badge>
          </div>
        </div>
        
        <Button variant="outline" onClick={() => setSelectedType(null)}>
          Change Type
        </Button>
      </div>

      {/* Order Form */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* Dine-in specific fields */}
          {selectedType === 'dine-in' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Table Number</label>
              <Select
                value={orderData.tableNumber?.toString()}
                onValueChange={(value) => setOrderData(prev => ({ ...prev, tableNumber: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      Table {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Customer information for takeout and delivery */}
          {(selectedType === 'takeout' || selectedType === 'delivery') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Customer Name
                  </label>
                  <Input
                    placeholder="Enter customer name"
                    value={orderData.customerName}
                    onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Phone Number
                  </label>
                  <Input
                    placeholder="Enter phone number"
                    value={orderData.phoneNumber}
                    onChange={(e) => setOrderData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
              </div>

              {/* Delivery address */}
              {selectedType === 'delivery' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Delivery Address
                  </label>
                  <Textarea
                    placeholder="Enter complete delivery address"
                    value={orderData.deliveryAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    rows={3}
                  />
                </div>
              )}
            </>
          )}

          {/* Estimated time */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Estimated Preparation Time (minutes)
            </label>
            <Input
              type="number"
              min="5"
              max="120"
              value={orderData.estimatedTime}
              onChange={(e) => setOrderData(prev => ({ ...prev, estimatedTime: parseInt(e.target.value) }))}
            />
          </div>

          {/* Special instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Special Instructions</label>
            <Textarea
              placeholder="Any special instructions for the kitchen..."
              value={orderData.specialInstructions}
              onChange={(e) => setOrderData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={() => setSelectedType(null)}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={!isFormValid()}
          className="flex-1"
        >
          Continue to Menu
        </Button>
      </div>

      {/* Order Summary */}
      <Card className="p-4 bg-muted/50">
        <h4 className="font-medium mb-2">Order Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="capitalize">{selectedType?.replace('-', ' ')}</span>
          </div>
          {selectedType === 'dine-in' && orderData.tableNumber && (
            <div className="flex justify-between">
              <span>Table:</span>
              <span>{orderData.tableNumber}</span>
            </div>
          )}
          {orderData.customerName && (
            <div className="flex justify-between">
              <span>Customer:</span>
              <span>{orderData.customerName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Est. Time:</span>
            <span>{orderData.estimatedTime} minutes</span>
          </div>
        </div>
      </Card>
    </div>
  );
};