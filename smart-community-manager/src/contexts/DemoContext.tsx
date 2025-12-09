import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DemoContextType {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  showUpgradeModal: () => void;
  hideUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
  demoStartTime: Date | null;
  demoTimeRemaining: number; // in seconds, 0 = unlimited for now
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const DEMO_SESSION_KEY = 'demo_session';
const DEMO_USER_KEY = 'demo_user';

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [demoStartTime, setDemoStartTime] = useState<Date | null>(null);
  const [demoTimeRemaining, setDemoTimeRemaining] = useState(0);

  // Check for existing demo session on mount
  useEffect(() => {
    const demoSession = localStorage.getItem(DEMO_SESSION_KEY);
    if (demoSession) {
      const session = JSON.parse(demoSession);
      setIsDemoMode(true);
      setDemoStartTime(new Date(session.startTime));
    }
  }, []);

  const enterDemoMode = () => {
    const startTime = new Date();
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({
      startTime: startTime.toISOString(),
      isDemo: true,
    }));
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify({
      id: 'demo-user',
      firstName: 'کاربر',
      lastName: 'دمو',
      phone: '09120000000',
      role: 'manager',
      isDemo: true,
    }));
    setIsDemoMode(true);
    setDemoStartTime(startTime);
  };

  const exitDemoMode = () => {
    localStorage.removeItem(DEMO_SESSION_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem('auth_session');
    localStorage.removeItem('auth_token');
    setIsDemoMode(false);
    setDemoStartTime(null);
  };

  const showUpgradeModal = () => setIsUpgradeModalOpen(true);
  const hideUpgradeModal = () => setIsUpgradeModalOpen(false);

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      enterDemoMode,
      exitDemoMode,
      showUpgradeModal,
      hideUpgradeModal,
      isUpgradeModalOpen,
      demoStartTime,
      demoTimeRemaining,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo(): DemoContextType {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
