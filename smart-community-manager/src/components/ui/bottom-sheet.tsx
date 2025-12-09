import * as React from 'react';
import { Drawer } from 'vaul';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  trigger?: React.ReactNode;
}

export function BottomSheet({ open, onOpenChange, children, trigger }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto max-h-[96%] flex-col rounded-t-2xl bg-card">
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

interface BottomSheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomSheetHeader({ children, className }: BottomSheetHeaderProps) {
  return (
    <div className={cn('mb-4 text-center', className)}>
      {children}
    </div>
  );
}

export function BottomSheetTitle({ children, className }: BottomSheetHeaderProps) {
  return (
    <h3 className={cn('text-lg font-semibold', className)}>
      {children}
    </h3>
  );
}

export function BottomSheetDescription({ children, className }: BottomSheetHeaderProps) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {children}
    </p>
  );
}
