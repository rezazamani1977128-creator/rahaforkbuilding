import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPersianNumber } from "@/lib/persian";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)]" />
      
      <div className="text-center space-y-6 animate-fade-in">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Building2 className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">{toPersianNumber(404)}</h1>
          <p className="text-xl font-medium">صفحه مورد نظر یافت نشد!</p>
          <p className="text-muted-foreground max-w-md mx-auto">
            به نظر می‌رسد آدرس وارد شده اشتباه است یا این صفحه وجود ندارد.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              صفحه اصلی
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 flip-rtl" />
              داشبورد
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
