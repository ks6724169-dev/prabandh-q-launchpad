import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];

export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") return null;
    if (error) throw error;
    return data?.role || null;
  } catch (error) {
    console.error("Error fetching user role:", error);
    return null;
  }
}

export async function setUserRole(userId: string, role: string, instituteId: string) {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role: role as any,
          institute_id: instituteId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error setting user role:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to set role" };
  }
}

export async function hasRole(userId: string, requiredRole: string): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole === requiredRole;
}

export async function hasAnyRole(userId: string, roles: string[]): Promise<boolean> {
  const userRole = await getUserRole(userId);
  return userRole ? roles.includes(userRole) : false;
}

export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, "admin");
}

export async function isTeacher(userId: string): Promise<boolean> {
  return hasRole(userId, "teacher");
}

export async function isStaff(userId: string): Promise<boolean> {
  return hasRole(userId, "staff");
}

export async function isStudent(userId: string): Promise<boolean> {
  return hasRole(userId, "student");
}
