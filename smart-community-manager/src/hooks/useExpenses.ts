import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, apiFetchBlob } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import { mockExpenses, Expense } from '@/data/mockData';

const EXPENSES_KEY = ['expenses'];

export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: EXPENSES_KEY,
    queryFn: async () => apiFetch<Expense[]>(API_ENDPOINTS.expenses.list),
    // Fallback to mock data so UI remains usable without backend
    initialData: mockExpenses,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Expense>) =>
      apiFetch<Expense>(API_ENDPOINTS.expenses.create, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Expense> & { id: string }) =>
      apiFetch<Expense>(API_ENDPOINTS.expenses.update.replace(':id', id), {
        method: 'PUT',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(API_ENDPOINTS.expenses.delete.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useDownloadExpenseReceipt() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await apiFetchBlob(
        API_ENDPOINTS.expenses.downloadReceipt.replace(':id', id),
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `expense-${id}-receipt.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
}
