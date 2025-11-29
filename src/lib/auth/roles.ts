/**
 * User roles enum
 */
export enum UserRole {
  USER = "user",
  EVENT_ADMIN = "event_admin",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string | null | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;

  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 0,
    [UserRole.EVENT_ADMIN]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.SUPER_ADMIN]: 3,
  };

  const userRoleLevel = roleHierarchy[userRole as UserRole] ?? -1;
  const requiredRoleLevel = roleHierarchy[requiredRole] ?? 999;

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Check if user is admin or higher
 */
export function isAdmin(userRole: string | null | undefined): boolean {
  return hasRole(userRole, UserRole.ADMIN);
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(userRole: string | null | undefined): boolean {
  return userRole === UserRole.SUPER_ADMIN;
}

/**
 * Check if user is event admin or higher
 */
export function isEventAdmin(userRole: string | null | undefined): boolean {
  return hasRole(userRole, UserRole.EVENT_ADMIN);
}

