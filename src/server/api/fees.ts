import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type FeeTransaction = Database["public"]["Tables"]["fee_transactions_receipts"]["Row"];
type FeeInsert = Database["public"]["Tables"]["fee_transactions_receipts"]["Insert"];

export async function recordFeePayment(feeData: FeeInsert) {
  try {
    // Generate receipt number
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${Date.now()}`;

    const { data, error } = await supabase
      .from("fee_transactions_receipts")
      .insert({
        ...feeData,
        receipt_number: receiptNumber,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data, receiptNumber };
  } catch (error) {
    console.error("Error recording fee payment:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to record payment" };
  }
}

export async function getStudentFees(studentId: string) {
  try {
    const { data, error } = await supabase
      .from("fee_transactions_receipts")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching student fees:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch fees" };
  }
}

export async function getInstituteFeeCollection(instituteId: string, startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from("fee_transactions_receipts")
      .select("*")
      .eq("institute_id", instituteId)
      .order("created_at", { ascending: false });

    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data, error } = await query;

    if (error) throw error;

    const totalCollected = data?.reduce((sum, record: any) => sum + (record.amount_paid || 0), 0) || 0;
    const transactionCount = data?.length || 0;

    return { success: true, data, totalCollected, transactionCount };
  } catch (error) {
    console.error("Error fetching fee collection:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch collection data" };
  }
}

export async function updateStudentDues(studentId: string, newDueAmount: number) {
  try {
    const { data, error } = await supabase
      .from("fee_transactions_receipts")
      .update({ pending_dues: newDueAmount })
      .eq("student_id", studentId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error updating student dues:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update dues" };
  }
}
