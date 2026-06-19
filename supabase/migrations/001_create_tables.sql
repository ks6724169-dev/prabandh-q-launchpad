-- Create enums for status types
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'holiday', 'leave');
CREATE TYPE payment_mode AS ENUM ('cash', 'bank_transfer', 'upi', 'card', 'cheque');
CREATE TYPE complaint_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE complaint_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'staff', 'student');

-- Create user_roles table to store role information
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  institute_id UUID REFERENCES institutes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_attendance_records table
CREATE TABLE IF NOT EXISTS student_attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'absent',
  course_semester_id UUID,
  subject VARCHAR(255),
  marked_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date, course_semester_id)
);

-- Create fee_transactions_receipts table
CREATE TABLE IF NOT EXISTS fee_transactions_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10, 2) NOT NULL,
  pending_dues DECIMAL(10, 2) DEFAULT 0,
  payment_mode payment_mode NOT NULL,
  receipt_url VARCHAR(500),
  receipt_number VARCHAR(50) UNIQUE,
  academic_month VARCHAR(50),
  notes TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teacher_timetables table
CREATE TABLE IF NOT EXISTS teacher_timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  day VARCHAR(20) NOT NULL,
  time_slot VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  class_room VARCHAR(50) NOT NULL,
  class_name VARCHAR(100),
  student_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create complaints_inquiries table
CREATE TABLE IF NOT EXISTS complaints_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status complaint_status NOT NULL DEFAULT 'open',
  priority complaint_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create ai_credit_management table
CREATE TABLE IF NOT EXISTS ai_credit_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  available_credits INTEGER DEFAULT 150,
  total_credits_purchased INTEGER DEFAULT 150,
  is_premium_unlocked BOOLEAN DEFAULT FALSE,
  premium_unlock_date TIMESTAMP WITH TIME ZONE,
  last_session_date TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_session_history table (for tracking AI usage)
CREATE TABLE IF NOT EXISTS ai_session_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  topic VARCHAR(255) NOT NULL,
  credits_used INTEGER NOT NULL,
  session_duration_minutes INTEGER,
  is_premium_topic BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_attendance_student_date ON student_attendance_records(student_id, date);
CREATE INDEX idx_attendance_institute ON student_attendance_records(institute_id);
CREATE INDEX idx_fees_student ON fee_transactions_receipts(student_id);
CREATE INDEX idx_fees_institute ON fee_transactions_receipts(institute_id);
CREATE INDEX idx_timetable_teacher ON teacher_timetables(teacher_id);
CREATE INDEX idx_complaints_user ON complaints_inquiries(user_id);
CREATE INDEX idx_complaints_status ON complaints_inquiries(status);
CREATE INDEX idx_ai_credits_user ON ai_credit_management(user_id);

-- Enable RLS on all tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credit_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_session_history ENABLE ROW LEVEL SECURITY;
