/**
 * Permission and role checking utilities
 * 
 * Role hierarchy: user < squad_leader < event_admin < admin < super_admin
 */

export type UserRole = "user" | "squad_leader" | "event_admin" | "admin" | "super_admin";

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
 * Role hierarchy: user < squad_leader < event_admin < admin < super_admin
 */
export function hasMinimumRole(user: User | null | undefined, minimumRole: UserRole): boolean {
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    user: 0,
    squad_leader: 1,
    event_admin: 2,
    admin: 3,
    super_admin: 4,
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
 * Admin has almost all super_admin rights except granting admin rights
 */
export function isAdmin(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.role === "admin" || user.role === "super_admin";
}

/**
 * Check if user is event admin or higher
 */
export function isEventAdmin(user: User | null | undefined): boolean {
  return hasMinimumRole(user, "event_admin");
}

/**
 * Check if user is squad leader or higher
 */
export function isSquadLeader(user: User | null | undefined): boolean {
  return hasMinimumRole(user, "squad_leader");
}

/**
 * Check if user can grant admin rights (only super_admin)
 */
export function canGrantAdminRights(user: User | null | undefined): boolean {
  return hasRole(user, "super_admin");
}
