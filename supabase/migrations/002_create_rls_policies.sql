-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles in institute" ON user_roles
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = user_roles.institute_id
    )
  );

CREATE POLICY "Admins can update roles" ON user_roles
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = user_roles.institute_id
    )
  );

-- RLS Policies for student_attendance_records
CREATE POLICY "Students can view their own attendance" ON student_attendance_records
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view attendance of their classes" ON student_attendance_records
  FOR SELECT USING (
    auth.uid() IN (
      SELECT teacher_id FROM teacher_timetables WHERE institute_id = student_attendance_records.institute_id
    )
  );

CREATE POLICY "Teachers can insert attendance" ON student_attendance_records
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT teacher_id FROM teacher_timetables WHERE institute_id = student_attendance_records.institute_id
    )
  );

CREATE POLICY "Teachers can update attendance they marked" ON student_attendance_records
  FOR UPDATE USING (
    auth.uid() = marked_by OR auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = student_attendance_records.institute_id
    )
  );

CREATE POLICY "Admins can view all attendance" ON student_attendance_records
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = student_attendance_records.institute_id
    )
  );

-- RLS Policies for fee_transactions_receipts
CREATE POLICY "Students can view their own fees" ON fee_transactions_receipts
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Staff can view and insert fees" ON fee_transactions_receipts
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'staff' AND institute_id = fee_transactions_receipts.institute_id
    )
  );

CREATE POLICY "Staff can record fees" ON fee_transactions_receipts
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'staff' AND institute_id = fee_transactions_receipts.institute_id
    )
  );

CREATE POLICY "Admins can manage all fees" ON fee_transactions_receipts
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = fee_transactions_receipts.institute_id
    )
  );

-- RLS Policies for teacher_timetables
CREATE POLICY "Teachers can view their own timetable" ON teacher_timetables
  FOR SELECT USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view all timetables" ON teacher_timetables
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'student' AND institute_id = teacher_timetables.institute_id
    )
  );

CREATE POLICY "Admins can manage timetables" ON teacher_timetables
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = teacher_timetables.institute_id
    )
  );

-- RLS Policies for complaints_inquiries
CREATE POLICY "Users can view their own complaints" ON complaints_inquiries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create complaints" ON complaints_inquiries
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND institute_id = complaints_inquiries.institute_id
    )
  );

CREATE POLICY "Staff can view and update complaints" ON complaints_inquiries
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'staff' AND institute_id = complaints_inquiries.institute_id
    )
  );

CREATE POLICY "Staff can update complaints" ON complaints_inquiries
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role IN ('staff', 'admin') AND institute_id = complaints_inquiries.institute_id
    )
  );

CREATE POLICY "Admins can manage all complaints" ON complaints_inquiries
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = complaints_inquiries.institute_id
    )
  );

-- RLS Policies for ai_credit_management
CREATE POLICY "Users can view their own AI credits" ON ai_credit_management
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI credits" ON ai_credit_management
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all AI credits" ON ai_credit_management
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = ai_credit_management.institute_id
    )
  );

-- RLS Policies for ai_session_history
CREATE POLICY "Users can view their own session history" ON ai_session_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create session records" ON ai_session_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all session history" ON ai_session_history
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_roles WHERE role = 'admin' AND institute_id = ai_session_history.institute_id
    )
  );
