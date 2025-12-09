import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, hasRolePermission } from '../constants/roles.constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { MESSAGES } from '../constants/messages.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException(MESSAGES.AUTH.UNAUTHORIZED);
    }

    // Super admins can access everything
    if (user.isSuperAdmin) {
      return true;
    }

    // Check if user has any of the required roles
    const userRole = user.role as UserRole;
    const hasPermission = requiredRoles.some((role) => hasRolePermission(userRole, role));

    if (!hasPermission) {
      throw new ForbiddenException(MESSAGES.AUTH.FORBIDDEN);
    }

    return true;
  }
}
