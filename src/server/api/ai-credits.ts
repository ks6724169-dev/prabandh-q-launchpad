import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AICredit = Database["public"]["Tables"]["ai_credit_management"]["Row"];
type AISession = Database["public"]["Tables"]["ai_session_history"]["Row"];

export async function getUserAICredits(userId: string) {
  try {
    const { data, error } = await supabase
      .from("ai_credit_management")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // No row found, return default
      return { success: true, data: null };
    }

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching AI credits:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch credits" };
  }
}

export async function deductAICredits(userId: string, creditsToDeduct: number, topic: string) {
  try {
    // Get current credits
    const { data: current, error: fetchError } = await supabase
      .from("ai_credit_management")
      .select("available_credits")
      .eq("user_id", userId)
      .single();

    if (fetchError) throw fetchError;

    const newCredits = Math.max(0, (current?.available_credits || 0) - creditsToDeduct);

    // Update credits
    const { data, error } = await supabase
      .from("ai_credit_management")
      .update({
        available_credits: newCredits,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    // Record session
    await recordAISession(userId, topic, creditsToDeduct);

    return { success: true, data, newCredits };
  } catch (error) {
    console.error("Error deducting AI credits:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to deduct credits" };
  }
}

export async function addAICredits(userId: string, creditsToAdd: number, instituteId: string) {
  try {
    let creditRecord = await getUserAICredits(userId);

    if (!creditRecord.data) {
      // Create new record
      const { data, error } = await supabase
        .from("ai_credit_management")
        .insert({
          user_id: userId,
          institute_id: instituteId,
          available_credits: creditsToAdd,
          total_credits_purchased: creditsToAdd,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    }

    // Update existing record
    const { data, error } = await supabase
      .from("ai_credit_management")
      .update({
        available_credits: (creditRecord.data?.available_credits || 0) + creditsToAdd,
        total_credits_purchased: (creditRecord.data?.total_credits_purchased || 0) + creditsToAdd,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error adding AI credits:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to add credits" };
  }
}

export async function unlockAIPremium(userId: string, instituteId: string) {
  try {
    const { data, error } = await supabase
      .from("ai_credit_management")
      .update({
        is_premium_unlocked: true,
        premium_unlock_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error unlocking premium:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to unlock premium" };
  }
}

export async function recordAISession(userId: string, topic: string, creditsUsed: number) {
  try {
    const { data, error } = await supabase
      .from("ai_session_history")
      .insert({
        user_id: userId,
        topic,
        credits_used: creditsUsed,
        // institute_id will need to be passed from caller
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error recording AI session:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to record session" };
  }
}

export async function getAISessionHistory(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("ai_session_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching session history:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch history" };
  }
}
