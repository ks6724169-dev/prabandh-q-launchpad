export type Database = {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: "admin" | "teacher" | "staff" | "student"
          institute_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: "admin" | "teacher" | "staff" | "student"
          institute_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: "admin" | "teacher" | "staff" | "student"
          institute_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      student_attendance_records: {
        Row: {
          id: string
          student_id: string
          institute_id: string
          date: string
          status: "present" | "absent" | "holiday" | "leave"
          course_semester_id: string | null
          subject: string | null
          marked_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          institute_id: string
          date: string
          status?: "present" | "absent" | "holiday" | "leave"
          course_semester_id?: string | null
          subject?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          institute_id?: string
          date?: string
          status?: "present" | "absent" | "holiday" | "leave"
          course_semester_id?: string | null
          subject?: string | null
          marked_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      fee_transactions_receipts: {
        Row: {
          id: string
          student_id: string
          institute_id: string
          amount_paid: number
          pending_dues: number
          payment_mode: "cash" | "bank_transfer" | "upi" | "card" | "cheque"
          receipt_url: string | null
          receipt_number: string
          academic_month: string | null
          notes: string | null
          recorded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          institute_id: string
          amount_paid: number
          pending_dues?: number
          payment_mode: "cash" | "bank_transfer" | "upi" | "card" | "cheque"
          receipt_url?: string | null
          receipt_number?: string
          academic_month?: string | null
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          institute_id?: string
          amount_paid?: number
          pending_dues?: number
          payment_mode?: "cash" | "bank_transfer" | "upi" | "card" | "cheque"
          receipt_url?: string | null
          receipt_number?: string
          academic_month?: string | null
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teacher_timetables: {
        Row: {
          id: string
          teacher_id: string
          institute_id: string
          day: string
          time_slot: string
          subject: string
          class_room: string
          class_name: string | null
          student_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          institute_id: string
          day: string
          time_slot: string
          subject: string
          class_room: string
          class_name?: string | null
          student_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          institute_id?: string
          day?: string
          time_slot?: string
          subject?: string
          class_room?: string
          class_name?: string | null
          student_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      complaints_inquiries: {
        Row: {
          id: string
          user_id: string
          institute_id: string
          type: string
          title: string
          description: string
          status: "open" | "in_progress" | "resolved" | "closed"
          priority: "low" | "medium" | "high" | "urgent"
          assigned_to: string | null
          resolution_notes: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          institute_id: string
          type: string
          title: string
          description: string
          status?: "open" | "in_progress" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "urgent"
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          institute_id?: string
          type?: string
          title?: string
          description?: string
          status?: "open" | "in_progress" | "resolved" | "closed"
          priority?: "low" | "medium" | "high" | "urgent"
          assigned_to?: string | null
          resolution_notes?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      ai_credit_management: {
        Row: {
          id: string
          user_id: string
          institute_id: string
          available_credits: number
          total_credits_purchased: number
          is_premium_unlocked: boolean
          premium_unlock_date: string | null
          last_session_date: string | null
          total_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institute_id: string
          available_credits?: number
          total_credits_purchased?: number
          is_premium_unlocked?: boolean
          premium_unlock_date?: string | null
          last_session_date?: string | null
          total_sessions?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institute_id?: string
          available_credits?: number
          total_credits_purchased?: number
          is_premium_unlocked?: boolean
          premium_unlock_date?: string | null
          last_session_date?: string | null
          total_sessions?: number
          created_at?: string
          updated_at?: string
        }
      }
      ai_session_history: {
        Row: {
          id: string
          user_id: string
          institute_id: string
          topic: string
          credits_used: number
          session_duration_minutes: number | null
          is_premium_topic: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institute_id: string
          topic: string
          credits_used: number
          session_duration_minutes?: number | null
          is_premium_topic?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institute_id?: string
          topic?: string
          credits_used?: number
          session_duration_minutes?: number | null
          is_premium_topic?: boolean
          created_at?: string
        }
      }
    }
  }
}
