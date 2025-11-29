/**
 * Permission and role checking utilities
 */

export type UserRole = "user" | "event_admin" | "admin" | "super_admin";

export interface User {
  id: string;
  role: UserRole;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if user has at least a specific role level
 * Role hierarchy: user < event_admin < admin < super_admin
 */
export function hasMinimumRole(user: User | null | undefined, minimumRole: UserRole): boolean {
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    user: 0,
    event_admin: 1,
    admin: 2,
    super_admin: 3,
  };

  return roleHierarchy[user.role] >= roleHierarchy[minimumRole];
}

/**
 * Check if user is super admin
 */
export function isSuperAdmin(user: User | null | undefined): boolean {
  return hasRole(user, "super_admin");
}

/**
 * Check if user is admin or super admin
 */
export function isAdmin(user: User | null | undefined): boolean {
  return hasMinimumRole(user, "admin");
}

/**
 * Check if user is event admin or higher
 */
export function isEventAdmin(user: User | null | undefined): boolean {
  return hasMinimumRole(user, "event_admin");
}
