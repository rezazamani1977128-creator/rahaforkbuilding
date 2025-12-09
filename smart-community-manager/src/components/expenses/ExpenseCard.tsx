import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash2 } from 'lucide-react';
import { expenseCategories } from '@/data/mockData';
import { formatCurrency, formatPersianDate } from '@/lib/utils';
import type { Expense } from '@/data/mockData';

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

export function ExpenseCard({ expense, onEdit, onDelete, onDownload }: ExpenseCardProps) {
  const category = expenseCategories.find(c => c.id === expense.category);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base">{expense.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
              {formatPersianDate(expense.createdAt)}
            </CardDescription>
          </div>
          <Badge
            style={{ backgroundColor: category?.color || '#ccc' }}
            className="text-white text-xs"
          >
            {category?.name}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">مبلغ</p>
          <p className="text-2xl font-bold">
            {formatCurrency(expense.amount, false)}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          {expense.vendor && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">فروشنده:</span>
              <span className="font-medium">{expense.vendor}</span>
            </div>
          )}

          {expense.description && (
            <div>
              <p className="text-muted-foreground mb-1">توضیح:</p>
              <p className="text-xs bg-muted p-2 rounded">{expense.description}</p>
            </div>
          )}

          {expense.approvedBy && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">تأیید شده توسط:</span>
              <span className="font-medium">{expense.approvedBy}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          {expense.receiptImage && (
            <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={onDownload}>
              <FileText className="h-4 w-4" />
              <span className="text-xs">رسید</span>
            </Button>
          )}

          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>

          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
