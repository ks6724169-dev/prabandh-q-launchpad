import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AttendanceRecord = Database["public"]["Tables"]["student_attendance_records"]["Row"];
type AttendanceInsert = Database["public"]["Tables"]["student_attendance_records"]["Insert"];

export async function markAttendance(attendanceData: AttendanceInsert[]) {
  try {
    const { data, error } = await supabase
      .from("student_attendance_records")
      .insert(attendanceData)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to mark attendance" };
  }
}

export async function getStudentAttendance(studentId: string, startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from("student_attendance_records")
      .select("*")
      .eq("student_id", studentId)
      .order("date", { ascending: false });

    if (startDate) query = query.gte("date", startDate);
    if (endDate) query = query.lte("date", endDate);

    const { data, error } = await query.limit(100);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch attendance" };
  }
}

export async function getClassAttendance(courseId: string, date: string) {
  try {
    const { data, error } = await supabase
      .from("student_attendance_records")
      .select("*")
      .eq("course_semester_id", courseId)
      .eq("date", date);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching class attendance:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch class attendance" };
  }
}

export async function getAttendanceStats(studentId: string) {
  try {
    const { data, error } = await supabase
      .from("student_attendance_records")
      .select("status")
      .eq("student_id", studentId)
      .in("status", ["present", "absent"]);

    if (error) throw error;

    const presentCount = data?.filter((r: any) => r.status === "present").length || 0;
    const totalDays = data?.length || 0;
    const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    return { success: true, data: { presentCount, totalDays, percentage } };
  } catch (error) {
    console.error("Error calculating attendance stats:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to calculate stats" };
  }
}
