# Phase 2 Implementation Guide: Residents & Payment Management

This guide provides step-by-step instructions for implementing Phase 2 features. Use this with Claude Opus 4.5 Thinking for optimal results.

## Phase 2 Overview

Phase 2 focuses on core resident and payment management features that are critical for the MVP.

### Features to Implement
1. ✅ Residents Management (full CRUD)
2. ✅ Payments Page (viewing and registering payments)
3. ✅ Expenses Page (tracking building expenses)
4. ✅ Payment Registration Modal
5. ✅ Bulk Actions (export, message, delete)

### Estimated Time: 4-5 days

---

## 1. Residents Management Page

### 1.1 Create Residents Table Component

**File**: `src/components/residents/ResidentTable.tsx`

This component displays a sortable, filterable table of residents with the following features:

- Resident information (name, avatar, contact)
- Unit details (number, floor)
- Role badge (owner/tenant)
- Payment status (paid/pending/overdue)
- Account balance
- Action menu (view, edit, delete, message, record payment)
- Checkbox selection for bulk actions

**Implementation Details**:
- Use existing shadcn/UI Table component
- Integrate with Avatar for profile pictures
- Status icons from lucide-react
- Color-coded payment status
- Hover effects and transitions

**Mock Data Structure**:
```typescript
interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  unit: { id: string; number: string; floor: number };
  role: 'owner' | 'tenant';
  status: 'active' | 'inactive';
  balance: number; // positive = owes, negative = credit
  paymentStatus: 'paid' | 'pending' | 'overdue';
  avatar?: string;
  joinedAt: Date;
}
```

### 1.2 Create Add/Edit Resident Modal

**File**: `src/components/residents/ResidentModal.tsx`

Multi-tab form with:
- **Tab 1 - Personal**: Name, phone, email, national ID
- **Tab 2 - Unit**: Unit selection, role (owner/tenant)
- **Tab 3 - Additional**: Vehicle plates, emergency contact

**Features**:
- Form validation (phone format, email validation)
- Dynamic field requirements
- Error state display
- Loading state during submission
- Support for both create and edit modes

### 1.3 Create Residents Page

**File**: `src/pages/manager/ResidentsPage.tsx`

Main page features:
- Header with stats (total residents, display filters)
- Search bar (name, phone, unit number)
- Filter dropdowns (role, payment status)
- Action buttons (Add resident, Import Excel, Export)
- ResidentTable component
- ResidentModal for add/edit
- Bulk action bar (when residents selected)

**Bulk Actions**:
- Send message to selected residents
- Export resident list to Excel
- Delete residents (with confirmation)
- Record payment for multiple residents

### Implementation Code Examples

```typescript
// Example: Using the ResidentTable
import { useState } from 'react';
import { ResidentTable } from '@/components/residents/ResidentTable';
import { ResidentModal } from '@/components/residents/ResidentModal';

export default function ResidentsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setModalOpen(true);
  };

  const handleSubmit = async (data: ResidentFormData) => {
    // Call API to save resident
    console.log('Saving:', data);
    setModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header, filters, etc */}
      <ResidentTable
        residents={filteredResidents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={setSelectedIds}
        selectedIds={selectedIds}
      />
      <ResidentModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        resident={editingResident}
        units={units}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

---

## 2. Payments Management Page

### 2.1 Create Payment Registration Modal

**File**: `src/components/payments/RegisterPaymentModal.tsx`

Modal for recording manual payments with:
- Payment date picker
- Amount input
- Payment method dropdown (Card, Bank Transfer, Cash, Check)
- Resident/Unit selector
- Invoice reference input
- Notes field
- Confirmation before submission

**Features**:
- Automatic amount population from resident balance
- Multiple payment methods with icons
- Date validation (can't be in future)
- Success notification after submission

### 2.2 Create Payments Page

**File**: `src/pages/manager/PaymentsPage.tsx`

Features:
- Payment list table with:
  - Resident name & unit
  - Amount paid
  - Date
  - Method (icon + label)
  - Status (verified/pending)
  - Receipt action
- Filters:
  - Date range picker (Persian calendar)
  - Status filter (all/verified/pending)
  - Payment method filter
  - Resident search
- Action buttons:
  - Register new payment
  - Export to Excel
  - Mark as verified (bulk action)
  - Send receipt (bulk action)

**Mock Data**:
```typescript
interface Payment {
  id: string;
  residentId: string;
  buildingId: string;
  amount: number;
  date: Date;
  method: 'card' | 'transfer' | 'cash' | 'check';
  status: 'verified' | 'pending';
  invoiceRef?: string;
  notes?: string;
  receiptUrl?: string;
}
```

### 2.3 Implementation Example

```typescript
const PaymentMethods = {
  card: { label: 'کارت اعتباری', icon: CreditCard, color: 'text-blue-600' },
  transfer: { label: 'انتقال بانکی', icon: Banknote, color: 'text-green-600' },
  cash: { label: 'نقد', icon: Coins, color: 'text-yellow-600' },
  check: { label: 'چک', icon: FileText, color: 'text-purple-600' },
};
```

---

## 3. Expenses Management Page

### 3.1 Create Expense Form Component

**File**: `src/components/expenses/ExpenseForm.tsx`

Form with:
- Category dropdown (maintenance, utilities, insurance, security, etc.)
- Amount input
- Description field
- Date picker
- Receipt file upload
- Vendor name
- Assigned to (property manager, service provider)

**Features**:
- Category icons from lucide-react
- File upload with preview
- Amount formatting
- Auto-categorization by keyword matching

### 3.2 Create Expenses Page

**File**: `src/pages/manager/ExpensesPage.tsx`

Features:
- Expense list with cards:
  - Category icon
  - Description
  - Amount
  - Date
  - Vendor
  - Receipt link
- Filters:
  - Date range
  - Category
  - Amount range
- Summary cards:
  - Total expenses this month
  - Average daily expense
  - Highest category
- Charts:
  - Monthly comparison (line chart)
  - Category breakdown (pie chart)
- Action buttons:
  - Add expense
  - Export to Excel
  - Delete expense

### 3.3 Mock Data

```typescript
interface Expense {
  id: string;
  buildingId: string;
  category: 'maintenance' | 'utilities' | 'insurance' | 'security' | 'cleaning' | 'other';
  amount: number;
  description: string;
  date: Date;
  vendor?: string;
  receiptUrl?: string;
  assignedTo?: string;
  notes?: string;
}
```

---

## 4. Utility Components & Helpers

### 4.1 Create Payment Methods Icon Map

**File**: `src/lib/payment-methods.ts`

```typescript
export const PaymentMethodConfig = {
  card: {
    label: 'کارت اعتباری',
    icon: CreditCard,
    color: 'bg-blue-500/10 text-blue-600',
  },
  transfer: {
    label: 'انتقال بانکی',
    icon: Banknote,
    color: 'bg-green-500/10 text-green-600',
  },
  cash: {
    label: 'نقد',
    icon: Coins,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  check: {
    label: 'چک',
    icon: FileText,
    color: 'bg-purple-500/10 text-purple-600',
  },
};
```

### 4.2 Create Expense Categories

**File**: `src/lib/expense-categories.ts`

```typescript
export const ExpenseCategories = {
  maintenance: { label: 'تعمیر و نگهداری', icon: Wrench, color: 'bg-red-500/10' },
  utilities: { label: 'قبوض و مصارف', icon: Zap, color: 'bg-yellow-500/10' },
  insurance: { label: 'بیمه', icon: Shield, color: 'bg-blue-500/10' },
  security: { label: 'امنیت', icon: Lock, color: 'bg-purple-500/10' },
  cleaning: { label: 'نظافت', icon: Sparkles, color: 'bg-green-500/10' },
  other: { label: 'دیگر', icon: MoreHorizontal, color: 'bg-gray-500/10' },
};
```

---

## 5. Integrating with Existing Mock Data

### Update mockData.ts

Add to existing `src/data/mockData.ts`:

```typescript
// Add residents mock data
export const mockResidents: Resident[] = [
  {
    id: '1',
    firstName: 'احمد',
    lastName: 'رضایی',
    phone: '09123456789',
    email: 'ahmad@example.com',
    unit: { id: '1', number: '101', floor: 1 },
    role: 'owner',
    status: 'active',
    balance: 450000, // owes 450,000
    paymentStatus: 'pending',
    joinedAt: new Date('2023-01-15'),
  },
  // ... more residents
];

// Add payments mock data
export const mockPayments: Payment[] = [
  {
    id: '1',
    residentId: '1',
    buildingId: '1',
    amount: 450000,
    date: new Date('2023-12-05'),
    method: 'card',
    status: 'verified',
    invoiceRef: 'INV-001',
  },
  // ... more payments
];

// Add expenses mock data
export const mockExpenses: Expense[] = [
  {
    id: '1',
    buildingId: '1',
    category: 'maintenance',
    amount: 500000,
    description: 'تعمیر آسانسور',
    date: new Date('2023-12-01'),
    vendor: 'شرکت نگهداری آسانسور',
  },
  // ... more expenses
];
```

---

## 6. Testing Checklist

- [ ] ResidentsPage loads and displays residents
- [ ] Search filters work (name, phone, unit)
- [ ] Add resident modal opens and validates
- [ ] Edit resident modal loads existing data
- [ ] Delete resident with confirmation
- [ ] Bulk selection works
- [ ] Bulk actions (export, message, delete)
- [ ] PaymentsPage displays all payments
- [ ] Payment filters work (date, method, status)
- [ ] Register payment modal opens
- [ ] ExpensesPage displays expenses
- [ ] Category and date filters work
- [ ] Charts update based on filters

---

## 7. File Structure

```
src/
├── pages/
│   └── manager/
│       ├── ResidentsPage.tsx      [NEW]
│       ├── PaymentsPage.tsx         [NEW]
│       └── ExpensesPage.tsx         [NEW]
├── components/
│   ├── residents/
│   │   ├── ResidentTable.tsx       [NEW]
│   │   ├── ResidentModal.tsx       [NEW]
│   │   └── ResidentFilters.tsx     [NEW - optional]
│   ├── payments/
│   │   ├── PaymentTable.tsx        [NEW]
│   │   ├── RegisterPaymentModal.tsx [NEW]
│   │   └── PaymentFilters.tsx      [NEW - optional]
│   └── expenses/
│       ├── ExpenseForm.tsx          [NEW]
│       ├── ExpenseList.tsx          [NEW]
│       └── ExpenseCharts.tsx        [NEW - optional]
└── lib/
    ├── payment-methods.ts           [NEW]
    └── expense-categories.ts        [NEW]
```

---

## 8. Integration with Existing App

Update `src/App.tsx` routes:

```typescript
<Route path="/manager/residents" element={<ResidentsPage />} />
<Route path="/manager/payments" element={<PaymentsPage />} />
<Route path="/manager/expenses" element={<ExpensesPage />} />
```

---

## 9. Implementation Order (Recommended)

1. Update mockData.ts with residents, payments, expenses
2. Create utility files (payment-methods.ts, expense-categories.ts)
3. Create ResidentsPage and components
4. Create PaymentsPage and components
5. Create ExpensesPage and components
6. Update App.tsx routes
7. Test all features

---

## 10. Key Considerations

- Use existing shadcn/UI components consistently
- Maintain RTL support for Persian text
- Implement proper error handling
- Add loading states during API calls
- Use toast notifications for success/errors
- Implement date pickers with Persian calendar support
- Use existing `formatPrice` and `toPersianNumber` utilities
- Maintain existing color scheme and animations

---

**Ready to implement?** Pass this document to Claude Opus 4.5 with the instruction:

"Based on this implementation guide for Phase 2 (Residents & Payment Management), create all the components and pages. Here's the current state of the app: [paste the current codebase context]"

