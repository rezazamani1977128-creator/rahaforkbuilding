import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockUnits, mockUsers, mockCharges, mockPayments } from '@/data/mockData';
import { Search, Building2, User, Receipt, CreditCard } from 'lucide-react';
import { toPersianNumber } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  type: 'unit' | 'user' | 'charge' | 'payment';
  icon: React.ReactNode;
  href: string;
  description?: string;
}

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const query = search.toLowerCase();
    const foundResults: SearchResult[] = [];

    try {
      // Search units
      if (mockUnits && Array.isArray(mockUnits)) {
        mockUnits.forEach((unit: any) => {
          if (unit.number.includes(search) || unit.id.toLowerCase().includes(query)) {
            foundResults.push({
              id: unit.id,
              title: `واحد ${unit.number}`,
              type: 'unit',
              icon: <Building2 className="h-4 w-4" />,
              href: '/manager/units',
              description: `طبقه ${unit.floor}`,
            });
          }
        });
      }

      // Search users
      if (mockUsers && Array.isArray(mockUsers)) {
        mockUsers.forEach((user: any) => {
          if (
            user.name.includes(search) ||
            user.phone.includes(search) ||
            user.id.toLowerCase().includes(query)
          ) {
            foundResults.push({
              id: user.id,
              title: user.name,
              type: 'user',
              icon: <User className="h-4 w-4" />,
              href: '/manager/residents',
              description: user.phone,
            });
          }
        });
      }

      // Search charges
      if (mockCharges && Array.isArray(mockCharges)) {
        mockCharges.forEach((charge: any) => {
          if (charge.id.toLowerCase().includes(query)) {
            foundResults.push({
              id: charge.id,
              title: `شارژ`,
              type: 'charge',
              icon: <Receipt className="h-4 w-4" />,
              href: '/manager/charges',
              description: `${charge.totalAmount} تومان`,
            });
          }
        });
      }

      // Search payments
      if (mockPayments && Array.isArray(mockPayments)) {
        mockPayments.forEach((payment: any) => {
          if (payment.id.toLowerCase().includes(query)) {
            foundResults.push({
              id: payment.id,
              title: `پرداخت`,
              type: 'payment',
              icon: <CreditCard className="h-4 w-4" />,
              href: '/manager/payments',
              description: payment.status === 'verified' ? 'تأیید شده' : 'در انتظار',
            });
          }
        });
      }

      setResults(foundResults.slice(0, 10));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
  }, [search]);

  const handleSelect = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="جستجو برای واحد، ساکن، شارژ یا پرداخت..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0"
            autoFocus
          />
        </div>

        {search && (
          <div className="max-h-[400px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="divide-y">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleSelect(result.href)}
                    className="w-full px-4 py-3 text-right hover:bg-muted transition-colors flex items-start gap-3"
                  >
                    <div className="text-muted-foreground mt-1">{result.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.title}</p>
                      {result.description && (
                        <p className="text-xs text-muted-foreground">{result.description}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">نتیجه‌ای یافت نشد</p>
              </div>
            )}
          </div>
        )}

        {!search && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">
              برای جستجو شروع کنید
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
