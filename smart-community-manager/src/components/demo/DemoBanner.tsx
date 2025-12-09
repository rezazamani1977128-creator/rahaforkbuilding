import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { X, Sparkles, ArrowLeft } from 'lucide-react';

export function DemoBanner() {
  const { isDemoMode, exitDemoMode, showUpgradeModal } = useDemo();
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isDemoMode || !isVisible) return null;

  const handleExit = () => {
    exitDemoMode();
    navigate('/');
  };

  const handleUpgrade = () => {
    showUpgradeModal();
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white py-2 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">حالت دمو</span>
          </div>
          <span className="text-sm hidden sm:inline">
            شما در حال مشاهده نسخه آزمایشی هستید. داده‌ها واقعی نیستند.
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white text-orange-600 hover:bg-white/90"
            onClick={handleUpgrade}
          >
            <Sparkles className="ml-2 h-4 w-4" />
            خرید اشتراک
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={handleExit}
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            خروج از دمو
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/20 h-8 w-8"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Floating demo badge for compact display
export function DemoBadge() {
  const { isDemoMode, showUpgradeModal } = useDemo();

  if (!isDemoMode) return null;

  return (
    <button
      onClick={showUpgradeModal}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
    >
      <Sparkles className="h-4 w-4" />
      <span className="text-sm font-medium">حالت دمو</span>
    </button>
  );
}
