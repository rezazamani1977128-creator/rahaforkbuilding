export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MANAGER = 'MANAGER',
  BOARD_MEMBER = 'BOARD_MEMBER',
  OWNER = 'OWNER',
  TENANT = 'TENANT',
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.MANAGER]: 80,
  [UserRole.BOARD_MEMBER]: 60,
  [UserRole.OWNER]: 40,
  [UserRole.TENANT]: 20,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'مدیر سیستم',
  [UserRole.MANAGER]: 'مدیر ساختمان',
  [UserRole.BOARD_MEMBER]: 'عضو هیئت مدیره',
  [UserRole.OWNER]: 'مالک',
  [UserRole.TENANT]: 'مستاجر',
};

export function hasRolePermission(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const MANAGEMENT_ROLES = [UserRole.SUPER_ADMIN, UserRole.MANAGER];
export const FINANCIAL_VIEW_ROLES = [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.BOARD_MEMBER];
export const CONTENT_CREATOR_ROLES = [UserRole.SUPER_ADMIN, UserRole.MANAGER, UserRole.BOARD_MEMBER];
