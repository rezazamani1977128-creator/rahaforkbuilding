import { ReactNode, useState } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { Lock, Sparkles } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DemoRestrictionProps {
  children: ReactNode;
  action?: string; // e.g., "delete", "export", "payment"
  feature?: string; // e.g., "حذف داده‌ها", "خروجی PDF"
  showTooltip?: boolean;
  disabled?: boolean;
}

// Wrap actions that should be restricted in demo mode
export function DemoRestriction({ 
  children, 
  action,
  feature,
  showTooltip = true,
  disabled = false
}: DemoRestrictionProps) {
  const { isDemoMode, showUpgradeModal } = useDemo();
  const [showAlert, setShowAlert] = useState(false);

  // If not in demo mode or not disabled, render children normally
  if (!isDemoMode || !disabled) {
    return <>{children}</>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAlert(true);
  };

  const content = (
    <div onClick={handleClick} className="cursor-not-allowed">
      <div className="pointer-events-none opacity-50">
        {children}
      </div>
    </div>
  );

  return (
    <>
      {showTooltip ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>این قابلیت در نسخه دمو محدود است</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        content
      )}

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <AlertDialogTitle className="text-center">
              قابلیت محدود در نسخه دمو
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {feature 
                ? `"${feature}" در نسخه آزمایشی در دسترس نیست.`
                : 'این عملیات در نسخه آزمایشی در دسترس نیست.'
              }
              <br />
              برای دسترسی کامل، اشتراک تهیه کنید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>بستن</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAlert(false);
                showUpgradeModal();
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500"
            >
              <Sparkles className="ml-2 h-4 w-4" />
              مشاهده پلن‌ها
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Hook to check if action is allowed in demo mode
export function useDemoRestriction() {
  const { isDemoMode, showUpgradeModal } = useDemo();

  const checkRestriction = (
    callback: () => void,
    options?: { feature?: string; allowInDemo?: boolean }
  ) => {
    if (isDemoMode && !options?.allowInDemo) {
      showUpgradeModal();
      return false;
    }
    callback();
    return true;
  };

  return { isDemoMode, checkRestriction };
}
