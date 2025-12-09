import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireBuilding?: boolean;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  requireBuilding = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, currentBuilding, buildings } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if building selection is required
  if (requireBuilding && !currentBuilding) {
    if (buildings.length > 1) {
      return <Navigate to="/select-building" state={{ from: location }} replace />;
    } else if (buildings.length === 0) {
      return <Navigate to="/register" state={{ from: location }} replace />;
    }
  }

  // Check role permissions
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentBuilding?.role || user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

// Specific role guards
export function ManagerRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['manager']}>
      {children}
    </ProtectedRoute>
  );
}

export function BoardMemberRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['manager', 'board_member']}>
      {children}
    </ProtectedRoute>
  );
}

export function ResidentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['manager', 'board_member', 'owner', 'tenant']}>
      {children}
    </ProtectedRoute>
  );
}
