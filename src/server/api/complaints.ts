import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Complaint = Database["public"]["Tables"]["complaints_inquiries"]["Row"];
type ComplaintInsert = Database["public"]["Tables"]["complaints_inquiries"]["Insert"];

export async function createComplaint(complaintData: ComplaintInsert) {
  try {
    const { data, error } = await supabase
      .from("complaints_inquiries")
      .insert(complaintData)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error creating complaint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create complaint" };
  }
}

export async function getComplaints(instituteId: string, filters?: { status?: string; priority?: string }) {
  try {
    let query = supabase
      .from("complaints_inquiries")
      .select("*")
      .eq("institute_id", instituteId)
      .order("created_at", { ascending: false });

    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.priority) query = query.eq("priority", filters.priority);

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch complaints" };
  }
}

export async function getUserComplaints(userId: string) {
  try {
    const { data, error } = await supabase
      .from("complaints_inquiries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch complaints" };
  }
}

export async function updateComplaint(complaintId: string, updates: Partial<Complaint>) {
  try {
    const { data, error } = await supabase
      .from("complaints_inquiries")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        resolved_at: updates.status === "resolved" ? new Date().toISOString() : undefined,
      })
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update complaint" };
  }
}

export async function deleteComplaint(complaintId: string) {
  try {
    const { error } = await supabase
      .from("complaints_inquiries")
      .delete()
      .eq("id", complaintId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting complaint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete complaint" };
  }
}

export async function assignComplaint(complaintId: string, staffUserId: string) {
  try {
    const { data, error } = await supabase
      .from("complaints_inquiries")
      .update({ assigned_to: staffUserId })
      .eq("id", complaintId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error assigning complaint:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to assign complaint" };
  }
}
