import { useState } from 'react';
import { Plus, X, Receipt, Wallet, Megaphone, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions: FABAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-40 md:hidden">
      {/* Actions */}
      <div className={cn(
        'absolute bottom-16 left-0 flex flex-col-reverse gap-2 transition-all duration-300',
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}>
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium shadow-lg whitespace-nowrap">
              {action.label}
            </span>
            <Button
              size="icon"
              className={cn('h-12 w-12 rounded-full shadow-lg', action.color)}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="icon"
        className={cn(
          'h-14 w-14 rounded-full shadow-xl transition-transform duration-300',
          isOpen && 'rotate-45'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}

// Default actions for manager dashboard
export function ManagerFAB() {
  return (
    <FloatingActionButton
      actions={[
        {
          icon: <Receipt className="h-5 w-5" />,
          label: 'صدور شارژ',
          onClick: () => console.log('Create charge'),
          color: 'bg-primary',
        },
        {
          icon: <Wallet className="h-5 w-5" />,
          label: 'ثبت هزینه',
          onClick: () => console.log('Add expense'),
          color: 'bg-warning',
        },
        {
          icon: <Megaphone className="h-5 w-5" />,
          label: 'اطلاعیه',
          onClick: () => console.log('Send announcement'),
          color: 'bg-secondary',
        },
        {
          icon: <CreditCard className="h-5 w-5" />,
          label: 'ثبت پرداخت',
          onClick: () => console.log('Register payment'),
          color: 'bg-success',
        },
      ]}
    />
  );
}
