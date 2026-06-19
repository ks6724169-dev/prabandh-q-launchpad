import { useAuth } from "./useAuth";

export function useRoleAccess() {
  const { role, loading } = useAuth();

  const hasRole = (requiredRole: string | string[]) => {
    if (loading) return false;
    if (Array.isArray(requiredRole)) {
      return role ? requiredRole.includes(role) : false;
    }
    return role === requiredRole;
  };

  const canAccess = (roles: string[]) => hasRole(roles);

  return {
    role,
    loading,
    isAdmin: role === "admin",
    isTeacher: role === "teacher",
    isStaff: role === "staff",
    isStudent: role === "student",
    hasRole,
    canAccess,
  };
}
