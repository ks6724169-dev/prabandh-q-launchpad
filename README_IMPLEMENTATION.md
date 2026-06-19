# Prabandh Q - Multi-Role ERP Dashboard Implementation

## Architecture Overview

This document outlines the complete database schema, backend API structure, and role-based access control (RBAC) implementation for the multi-role ERP system.

## Database Schema

### Tables

#### 1. `user_roles`
Stores role information for each user in the system.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → auth.users)
  - `role`: ENUM (admin, teacher, staff, student)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `created_at`, `updated_at`: Timestamps

#### 2. `student_attendance_records`
Track daily attendance for students.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `student_id`: UUID (Foreign Key → auth.users)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `date`: DATE
  - `status`: ENUM (present, absent, holiday, leave)
  - `course_semester_id`: UUID (optional)
  - `subject`: VARCHAR(255)
  - `marked_by`: UUID (Foreign Key → auth.users)
  - `created_at`, `updated_at`: Timestamps

#### 3. `fee_transactions_receipts`
Manage fee payments and receipts.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `student_id`: UUID (Foreign Key → auth.users)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `amount_paid`: DECIMAL(10,2)
  - `pending_dues`: DECIMAL(10,2)
  - `payment_mode`: ENUM (cash, bank_transfer, upi, card, cheque)
  - `receipt_url`: VARCHAR(500)
  - `receipt_number`: VARCHAR(50) - Auto-generated
  - `academic_month`: VARCHAR(50)
  - `recorded_by`: UUID (Foreign Key → auth.users)
  - `created_at`, `updated_at`: Timestamps

#### 4. `teacher_timetables`
Store teacher schedules and class information.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `teacher_id`: UUID (Foreign Key → auth.users)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `day`: VARCHAR(20)
  - `time_slot`: VARCHAR(50)
  - `subject`: VARCHAR(255)
  - `class_room`: VARCHAR(50)
  - `class_name`: VARCHAR(100)
  - `student_count`: INTEGER
  - `created_at`, `updated_at`: Timestamps

#### 5. `complaints_inquiries`
Track student complaints and staff inquiries.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → auth.users)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `type`: VARCHAR(100)
  - `title`: VARCHAR(255)
  - `description`: TEXT
  - `status`: ENUM (open, in_progress, resolved, closed)
  - `priority`: ENUM (low, medium, high, urgent)
  - `assigned_to`: UUID (Foreign Key → auth.users)
  - `resolution_notes`: TEXT
  - `created_at`, `updated_at`: Timestamps
  - `resolved_at`: TIMESTAMP (nullable)

#### 6. `ai_credit_management`
Manage AI study assistant credits per user.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → auth.users) - UNIQUE
  - `institute_id`: UUID (Foreign Key → institutes)
  - `available_credits`: INTEGER (default: 150)
  - `total_credits_purchased`: INTEGER
  - `is_premium_unlocked`: BOOLEAN (default: FALSE)
  - `premium_unlock_date`: TIMESTAMP (nullable)
  - `last_session_date`: TIMESTAMP (nullable)
  - `total_sessions`: INTEGER
  - `created_at`, `updated_at`: Timestamps

#### 7. `ai_session_history`
Track all AI study sessions and credit usage.
- **Columns:**
  - `id`: UUID (Primary Key)
  - `user_id`: UUID (Foreign Key → auth.users)
  - `institute_id`: UUID (Foreign Key → institutes)
  - `topic`: VARCHAR(255)
  - `credits_used`: INTEGER
  - `session_duration_minutes`: INTEGER (nullable)
  - `is_premium_topic`: BOOLEAN (default: FALSE)
  - `created_at`: TIMESTAMP

## Row Level Security (RLS) Policies

### User Roles
- **Students** can only view their own role
- **Admins** can view all roles in their institute
- **Admins** can update roles

### Student Attendance
- **Students** can view their own attendance
- **Teachers** can view attendance for their classes
- **Teachers** can mark attendance
- **Admins** can view all attendance records

### Fee Transactions
- **Students** can view their own fee records
- **Staff** can view and record fees
- **Admins** can manage all fee records

### Teacher Timetables
- **Teachers** can view their own timetables
- **Students** can view all timetables
- **Admins** can manage all timetables

### Complaints
- **Users** can view and create their own complaints
- **Staff** can view and update complaints
- **Admins** can manage all complaints

### AI Credits
- **Users** can view and update their own credits
- **Admins** can view all credit information

## API Endpoints

### Attendance API (`/src/server/api/attendance.ts`)

```typescript
// Mark attendance for multiple students
markAttendance(attendanceData: AttendanceInsert[])

// Get student's attendance records
getStudentAttendance(studentId: string, startDate?: string, endDate?: string)

// Get attendance for a specific class
getClassAttendance(courseId: string, date: string)

// Calculate attendance statistics
getAttendanceStats(studentId: string)
```

### Fees API (`/src/server/api/fees.ts`)

```typescript
// Record a fee payment
recordFeePayment(feeData: FeeInsert)

// Get student's fee records
getStudentFees(studentId: string)

// Get institute's total fee collection
getInstituteFeeCollection(instituteId: string, startDate?: string, endDate?: string)

// Update student's pending dues
updateStudentDues(studentId: string, newDueAmount: number)
```

### Complaints API (`/src/server/api/complaints.ts`)

```typescript
// Create a new complaint
creatomplaint(complaintData: ComplaintInsert)

// Get all complaints for institute
getComplaints(instituteId: string, filters?: { status?: string; priority?: string })

// Get user's complaints
getUserComplaints(userId: string)

// Update complaint status
updateComplaint(complaintId: string, updates: Partial<Complaint>)

// Delete complaint
deleteComplaint(complaintId: string)

// Assign complaint to staff
assignComplaint(complaintId: string, staffUserId: string)
```

### AI Credits API (`/src/server/api/ai-credits.ts`)

```typescript
// Get user's AI credits
getUserAICredits(userId: string)

// Deduct credits from user
deductAICredits(userId: string, creditsToDeduct: number, topic: string)

// Add credits to user
addAICredits(userId: string, creditsToAdd: number, instituteId: string)

// Unlock premium AI features
unlockAIPremium(userId: string, instituteId: string)

// Get user's session history
getAISessionHistory(userId: string, limit?: number)
```

### Authentication API (`/src/server/api/auth.ts`)

```typescript
// Get user's role
getUserRole(userId: string)

// Set/update user role
setUserRole(userId: string, role: string, instituteId: string)

// Check if user has specific role
hasRole(userId: string, requiredRole: string)

// Check if user has any of multiple roles
hasAnyRole(userId: string, roles: string[])

// Helper functions
isAdmin(userId: string)
isTeacher(userId: string)
isStaff(userId: string)
isStudent(userId: string)
```

## Hooks for Frontend

### `useAuth()`
Provides current user and role information.
```typescript
const { user, role, loading } = useAuth();
```

### `useRoleAccess()`
Provides role-based access control helpers.
```typescript
const { isAdmin, isTeacher, isStaff, isStudent, hasRole, canAccess } = useRoleAccess();

// Usage
if (isAdmin) {
  // Show admin panel
}
```

## Implementation Steps

1. **Run Migrations:**
   - Execute `supabase/migrations/001_create_tables.sql` to create all tables
   - Execute `supabase/migrations/002_create_rls_policies.sql` to set up RLS policies

2. **Import APIs:**
   - Use the API functions from `src/server/api/` in your routes

3. **Use Hooks:**
   - Import `useAuth()` and `useRoleAccess()` in your components

4. **Integrate with Frontend:**
   - Call API functions in your route handlers
   - Use hooks for conditional rendering based on roles

## Security Considerations

✅ **Row Level Security (RLS):** All tables have RLS enabled
✅ **Role-Based Access:** API functions validate user roles
✅ **Data Isolation:** Users only access their own or authorized data
✅ **Audit Trail:** `created_at`, `updated_at`, and `marked_by` fields track changes
✅ **Type Safety:** TypeScript types ensure proper data handling

## Next Steps

1. Integrate API calls with frontend components
2. Add payment gateway for credit purchases
3. Implement notification system for complaints
4. Create admin dashboard for analytics
5. Add file upload for receipts and documents
