/**
 * User roles enum
 * Role hierarchy: USER < SQUAD_LEADER < EVENT_ADMIN < ADMIN < SUPER_ADMIN
 */
export enum UserRole {
  USER = "user",
  SQUAD_LEADER = "squad_leader",
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
    [UserRole.SQUAD_LEADER]: 1,
    [UserRole.EVENT_ADMIN]: 2,
    [UserRole.ADMIN]: 3,
    [UserRole.SUPER_ADMIN]: 4,
  };

  const userRoleLevel = roleHierarchy[userRole as UserRole] ?? -1;
  const requiredRoleLevel = roleHierarchy[requiredRole] ?? 999;

  return userRoleLevel >= requiredRoleLevel;
}

/**
 * Check if user is admin or higher (admin or super_admin)
 */
export function isAdmin(userRole: string | null | undefined): boolean {
  if (!userRole) return false;
  return userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN;
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

/**
 * Check if user is squad leader or higher
 */
export function isSquadLeader(userRole: string | null | undefined): boolean {
  return hasRole(userRole, UserRole.SQUAD_LEADER);
}

