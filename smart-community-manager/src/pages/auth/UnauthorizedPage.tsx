import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX, Home, ArrowRight } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">دسترسی غیرمجاز</CardTitle>
          <CardDescription className="text-base">
            شما اجازه دسترسی به این بخش را ندارید.
            <br />
            لطفاً با مدیر ساختمان تماس بگیرید.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button onClick={() => navigate('/')} className="w-full gap-2">
            <Home className="h-4 w-4" />
            بازگشت به صفحه اصلی
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)} 
            className="w-full gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت به صفحه قبل
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
