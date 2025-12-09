import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockUsers, mockUnits } from '@/data/mockData';

interface RegisterPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paymentMethods = [
  { value: 'online', label: 'آنلاین' },
  { value: 'card_to_card', label: 'کارت به کارت' },
  { value: 'cash', label: 'نقد' },
  { value: 'check', label: 'چک' },
];

export function RegisterPaymentModal({ open, onOpenChange }: RegisterPaymentModalProps) {
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('online');
  const [description, setDescription] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedResident = mockUsers.find(u => u.id === selectedResidentId);
  const selectedUnit = selectedResident?.unitId ? mockUnits.find(u => u.id === selectedResident.unitId) : null;

  const residents = mockUsers.filter(u => u.role !== 'manager');

  const handleSubmit = async () => {
    if (!selectedResidentId || !amount || !method) {
      alert('لطفاً تمام فیلدهای الزامی را پر کنید');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      onOpenChange(false);
      // Reset form
      setSelectedResidentId('');
      setAmount('');
      setMethod('online');
      setDescription('');
      setTransactionId('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ثبت پرداخت جدید</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resident Selection */}
          <div className="space-y-2">
            <Label htmlFor="resident">ساکن *</Label>
            <Select value={selectedResidentId} onValueChange={setSelectedResidentId}>
              <SelectTrigger id="resident">
                <SelectValue placeholder="انتخاب ساکن" />
              </SelectTrigger>
              <SelectContent>
                {residents.map(resident => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name} - {resident.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit Info Display */}
          {selectedUnit && (
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm">
              <p className="text-muted-foreground">واحد: <span className="font-medium text-foreground">{selectedUnit.number}</span></p>
              <p className="text-muted-foreground">باقی‌مانده: <span className="font-medium text-foreground">{new Intl.NumberFormat('fa-IR').format(Math.abs(selectedUnit.balance))} تومان</span></p>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">مبلغ (تومان) *</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000000"
              dir="ltr"
              className="text-left"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method">روش پرداخت *</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map(m => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction ID */}
          <div className="space-y-2">
            <Label htmlFor="transactionId">شماره تراکنش</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="شماره تراکنش (اختیاری)"
              className="rtl"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات اضافی (اختیاری)"
              className="rtl resize-none"
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading || !selectedResidentId || !amount}>
              {isLoading ? 'درحال ثبت...' : 'ثبت پرداخت'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
