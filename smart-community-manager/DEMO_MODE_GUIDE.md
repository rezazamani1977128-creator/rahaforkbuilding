# Demo Mode - Quick Reference Guide

## 🚀 Quick Start

### For End Users
1. Visit the landing page at `/`
2. Click **"دمو رایگان"** button (green button with Play icon)
3. Automatically logged in as demo manager
4. Explore the platform with pre-populated data
5. Click **"خرید اشتراک"** to see pricing
6. Click **"خروج از دمو"** to exit

### For Developers
```typescript
import { useDemo } from '@/contexts/DemoContext';

const { isDemoMode, enterDemoMode, exitDemoMode, showUpgradeModal } = useDemo();
```

---

## 📚 API Reference

### `useDemo()` Hook

```typescript
interface DemoContextType {
  isDemoMode: boolean;              // Is demo mode active?
  enterDemoMode: () => void;        // Enter demo mode
  exitDemoMode: () => void;         // Exit demo mode
  showUpgradeModal: () => void;     // Show upgrade modal
  hideUpgradeModal: () => void;     // Hide upgrade modal
  isUpgradeModalOpen: boolean;      // Is modal open?
  demoStartTime: Date | null;       // When demo started
  demoTimeRemaining: number;        // Seconds remaining (0 = unlimited)
}
```

### Usage Examples

#### Check if Demo Mode
```tsx
const { isDemoMode } = useDemo();

if (isDemoMode) {
  // Show demo-specific UI
}
```

#### Enter Demo Mode
```tsx
const { enterDemoMode } = useDemo();
const navigate = useNavigate();

const handleTryDemo = () => {
  enterDemoMode();
  navigate('/manager/dashboard');
};
```

#### Exit Demo Mode
```tsx
const { exitDemoMode } = useDemo();
const navigate = useNavigate();

const handleExit = () => {
  exitDemoMode();
  navigate('/');
};
```

#### Show Upgrade Modal
```tsx
const { showUpgradeModal } = useDemo();

<Button onClick={showUpgradeModal}>
  مشاهده پلن‌ها
</Button>
```

---

## 🛡️ Restricting Actions

### Using `<DemoRestriction>` Component

```tsx
import { DemoRestriction } from '@/components/demo/DemoRestriction';

// Wrap any button/action that should be restricted
<DemoRestriction 
  feature="حذف کاربر"    // Feature name (optional)
  disabled={true}        // Should restrict? (default: false)
  showTooltip={true}     // Show tooltip on hover? (default: true)
>
  <Button onClick={handleDelete}>
    حذف
  </Button>
</DemoRestriction>
```

### Using `useDemoRestriction()` Hook

```tsx
import { useDemoRestriction } from '@/components/demo/DemoRestriction';

const { isDemoMode, checkRestriction } = useDemoRestriction();

const handleExport = () => {
  checkRestriction(
    () => {
      // This runs only if NOT in demo mode
      exportToPDF();
    },
    { 
      feature: 'خروجی PDF',  // Feature name shown in alert
      allowInDemo: false     // Allow in demo? (default: false)
    }
  );
};
```

### Programmatic Check

```tsx
const { isDemoMode, showUpgradeModal } = useDemo();

const handleAction = () => {
  if (isDemoMode) {
    showUpgradeModal();
    return;
  }
  
  // Perform action
  doSomething();
};
```

---

## 🎨 UI Components

### Demo Banner
- **Location**: Top of page (below header)
- **Visibility**: Only when `isDemoMode === true`
- **Features**:
  - Shows demo message
  - "خرید اشتراک" button → Opens upgrade modal
  - "خروج از دمو" button → Exits demo and returns to landing
  - X button → Dismisses banner (session persists)

### Demo Badge (Floating)
- **Location**: Fixed bottom-left
- **Visibility**: Only when `isDemoMode === true`
- **Features**:
  - Shows "حالت دمو" text with Sparkles icon
  - Clicking opens upgrade modal
  - Always visible as secondary indicator

### Demo Badge (Header)
- **Location**: Manager/Resident layout headers
- **Visibility**: Only when `isDemoMode === true`
- **Manager Layout**: Next to display name, shows "حالت دمو"
- **Resident Layout**: In actions area, shows "دمو" (compact)

### Upgrade Modal
- **Trigger**: Click "خرید اشتراک" anywhere
- **Content**: 3 pricing tiers with features
- **Action**: Click plan → Exits demo → Navigates to pricing page

---

## 💾 Data Storage

### localStorage Keys
```typescript
'demo_session'  // JSON: { startTime: ISO string, isDemo: true }
'demo_user'     // JSON: { id, firstName, lastName, phone, role, isDemo }
```

### Demo User Object
```typescript
{
  id: 'demo-user',
  firstName: 'کاربر',
  lastName: 'دمو',
  phone: '09120000000',
  role: 'manager',
  isDemo: true
}
```

### Demo Building Object
```typescript
{
  id: 'demo-building',
  name: 'ساختمان دمو',
  address: 'تهران، خیابان آزادی',
  unitsCount: 24,
  role: 'manager'
}
```

---

## 🔄 User Flow

### Entry Flow
```
Landing Page (/)
  ↓ Click "دمو رایگان"
enterDemoMode() called
  ↓ localStorage.setItem('demo_session', ...)
  ↓ localStorage.setItem('demo_user', ...)
Navigate to /manager/dashboard
  ↓ AuthContext detects demo session
Create demo user & building
  ↓ Dispatch LOGIN_SUCCESS
User sees manager dashboard
  ↓ Demo banner appears
  ↓ Demo badge appears in header
User explores features
```

### Exit Flow
```
User in demo mode
  ↓ Click "خروج از دمو"
exitDemoMode() called
  ↓ localStorage.removeItem('demo_session')
  ↓ localStorage.removeItem('demo_user')
  ↓ localStorage.removeItem('auth_session')
  ↓ localStorage.removeItem('auth_token')
Navigate to /
  ↓ User logged out
  ↓ Demo indicators removed
Back to landing page
```

### Upgrade Flow
```
User in demo mode
  ↓ Click "خرید اشتراک"
showUpgradeModal() called
  ↓ Modal opens
User sees 3 pricing tiers
  ↓ Click "انتخاب پلن"
exitDemoMode() called
  ↓ Demo session cleared
Navigate to /pricing?plan={id}
  ↓ Pricing page with selected plan highlighted
User can register
```

---

## 🎯 Common Use Cases

### 1. Add Demo Badge to Custom Component
```tsx
import { useDemo } from '@/contexts/DemoContext';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

function MyComponent() {
  const { isDemoMode } = useDemo();
  
  return (
    <div>
      {isDemoMode && (
        <Badge variant="outline" className="bg-amber-100">
          <Sparkles className="h-3 w-3 ml-1" />
          دمو
        </Badge>
      )}
    </div>
  );
}
```

### 2. Disable Feature in Demo Mode
```tsx
import { useDemo } from '@/contexts/DemoContext';

function DeleteButton() {
  const { isDemoMode, showUpgradeModal } = useDemo();
  
  return (
    <Button 
      onClick={() => {
        if (isDemoMode) {
          showUpgradeModal();
        } else {
          handleDelete();
        }
      }}
      disabled={isDemoMode}
    >
      حذف
    </Button>
  );
}
```

### 3. Show Demo-Specific Message
```tsx
import { useDemo } from '@/contexts/DemoContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

function ReportPage() {
  const { isDemoMode } = useDemo();
  
  return (
    <div>
      {isDemoMode && (
        <Alert>
          <AlertDescription>
            این گزارش با داده‌های نمونه تهیه شده است.
          </AlertDescription>
        </Alert>
      )}
      {/* Report content */}
    </div>
  );
}
```

### 4. Conditionally Load Data
```tsx
import { useDemo } from '@/contexts/DemoContext';
import { mockData } from '@/data/mockData';

function Dashboard() {
  const { isDemoMode } = useDemo();
  
  const data = isDemoMode 
    ? mockData  // Use mock data in demo
    : await fetchRealData();  // Fetch from API in production
  
  return <DashboardView data={data} />;
}
```

---

## 🐛 Troubleshooting

### Demo Mode Not Activating
**Problem**: Clicking "دمو رایگان" doesn't work  
**Solution**: 
1. Check browser console for errors
2. Verify `DemoProvider` wraps App in `App.tsx`
3. Check localStorage is enabled in browser

### Demo Session Not Persisting
**Problem**: Refreshing page exits demo mode  
**Solution**:
1. Check localStorage for `demo_session` key
2. Verify `AuthContext` checks for demo session in `useEffect`
3. Make sure demo session is JSON string, not object

### Upgrade Modal Not Opening
**Problem**: Clicking "خرید اشتراک" does nothing  
**Solution**:
1. Verify `UpgradeModal` rendered globally in `App.tsx`
2. Check `showUpgradeModal()` function called correctly
3. Inspect `isUpgradeModalOpen` state in DemoContext

### Demo Badge Not Showing
**Problem**: Badge not visible in layout  
**Solution**:
1. Check `isDemoMode` value (console.log)
2. Verify layout imports `useDemo` hook
3. Check CSS classes for visibility (dark mode colors)

---

## 📝 Best Practices

### DO ✅
- Always wrap destructive actions with `<DemoRestriction>`
- Show clear demo indicators in UI
- Use mock data for demo mode
- Clear demo session completely on exit
- Test demo flow regularly
- Document restricted features

### DON'T ❌
- Don't allow real payments in demo mode
- Don't store demo data in production database
- Don't mix demo and real user sessions
- Don't forget to clear localStorage on exit
- Don't restrict read-only features
- Don't make demo time unlimited without warning

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `src/contexts/DemoContext.tsx` | Demo state management |
| `src/components/demo/DemoBanner.tsx` | Banner and badge components |
| `src/components/demo/UpgradeModal.tsx` | Pricing modal |
| `src/components/demo/DemoRestriction.tsx` | Action restrictions |
| `src/pages/public/LandingPage.tsx` | Marketing landing page |
| `src/pages/public/PricingPage.tsx` | Pricing plans page |
| `src/App.tsx` | Demo integration |
| `src/contexts/AuthContext.tsx` | Demo session handling |

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review `DEMO_MODE_COMPLETE.md` for detailed implementation
3. Check `DEMO_MODE_VERIFICATION.md` for testing checklist
4. Search for similar issues in project documentation

---

**Last Updated**: December 8, 2025  
**Version**: 1.0.0  
**Status**: Production Ready ✅
