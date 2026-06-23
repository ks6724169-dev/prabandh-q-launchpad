import {
  LayoutDashboard, UserCog, Users, CalendarCheck, BookOpen, NotebookPen, ClipboardList,
  FileEdit, FolderOpen, Video, FileCheck2, GraduationCap, FileBarChart2, LineChart,
  MessagesSquare, HeartHandshake, CalendarRange, ShieldAlert, HelpCircle, Brain,
  Library, Award, Plane, Wallet, BookMarked, FileText, BarChart3, Bell, Lock, Settings,
  type LucideIcon,
} from "lucide-react";

export type TeacherModuleDef = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  category: "Classroom" | "Academics" | "Evaluation" | "Communication" | "Operations" | "Intelligence" | "Personal" | "Platform";
};

export const TEACHER_MODULES: TeacherModuleDef[] = [
  { slug: "dashboard", number: 1, title: "Teacher Dashboard", subtitle: "Today's schedule, KPIs, AI insights & quick actions.", icon: LayoutDashboard, category: "Classroom" },
  { slug: "profile", number: 2, title: "Teacher Profile", subtitle: "Personal info, qualifications, certificates & bank details.", icon: UserCog, category: "Personal" },
  { slug: "classes", number: 3, title: "Class Management", subtitle: "Assigned classes, section roster & student profiles.", icon: Users, category: "Classroom" },
  { slug: "attendance", number: 4, title: "Attendance Management", subtitle: "Daily, subject-wise, bulk & AI absentee alerts.", icon: CalendarCheck, category: "Classroom" },
  { slug: "subjects", number: 5, title: "Subject Management", subtitle: "Syllabus, chapters & AI completion prediction.", icon: BookOpen, category: "Academics" },
  { slug: "lesson-plans", number: 6, title: "Lesson Planning", subtitle: "Daily/weekly plans with AI lesson generator.", icon: NotebookPen, category: "Academics" },
  { slug: "homework", number: 7, title: "Homework Management", subtitle: "Create, track & AI homework generator.", icon: ClipboardList, category: "Evaluation" },
  { slug: "assignments", number: 8, title: "Assignment Management", subtitle: "Distribution, submissions & AI rubric generator.", icon: FileEdit, category: "Evaluation" },
  { slug: "materials", number: 9, title: "Study Materials", subtitle: "Notes, PDFs, videos & AI content summary.", icon: FolderOpen, category: "Academics" },
  { slug: "online-classes", number: 10, title: "Online Classes", subtitle: "Live, recorded & AI auto-notes generator.", icon: Video, category: "Classroom" },
  { slug: "exams", number: 11, title: "Examination Management", subtitle: "Marks entry & AI question paper generator.", icon: FileCheck2, category: "Evaluation" },
  { slug: "assessment", number: 12, title: "Assessment & Evaluation", subtitle: "Continuous, practical & AI smart evaluation.", icon: GraduationCap, category: "Evaluation" },
  { slug: "report-cards", number: 13, title: "Report Cards", subtitle: "Progress reports with AI personalised remarks.", icon: FileBarChart2, category: "Evaluation" },
  { slug: "performance", number: 14, title: "Performance Analytics", subtitle: "Top performers, weak students & AI prediction.", icon: LineChart, category: "Intelligence" },
  { slug: "communication", number: 15, title: "Communication Center", subtitle: "Messages, announcements & AI translation assistant.", icon: MessagesSquare, category: "Communication" },
  { slug: "parents", number: 16, title: "Parent Interaction", subtitle: "Meetings, feedback & AI communication assistant.", icon: HeartHandshake, category: "Communication" },
  { slug: "calendar", number: 17, title: "Calendar & Scheduling", subtitle: "Academic, exam & AI smart scheduling.", icon: CalendarRange, category: "Operations" },
  { slug: "behavior", number: 18, title: "Behavior Management", subtitle: "Discipline records & AI behaviour pattern analysis.", icon: ShieldAlert, category: "Classroom" },
  { slug: "doubts", number: 19, title: "Doubt Resolution", subtitle: "Forum, repository & AI doubt solver.", icon: HelpCircle, category: "Academics" },
  { slug: "ai-assistant", number: 20, title: "AI Teaching Assistant", subtitle: "Co-teacher, quiz, worksheet & notes generators.", icon: Brain, category: "Intelligence" },
  { slug: "resources", number: 21, title: "Resource Library", subtitle: "Notes, question bank & AI recommendations.", icon: Library, category: "Academics" },
  { slug: "certificates", number: 22, title: "Certificates & Awards", subtitle: "Personal certificates, achievements & trainings.", icon: Award, category: "Personal" },
  { slug: "leave", number: 23, title: "Leave Management", subtitle: "Apply, history, balance & AI leave trend analytics.", icon: Plane, category: "Personal" },
  { slug: "payroll", number: 24, title: "Payroll Access", subtitle: "Salary, payslips, tax & salary history.", icon: Wallet, category: "Personal" },
  { slug: "development", number: 25, title: "Professional Development", subtitle: "Trainings, certifications & AI skill gap analysis.", icon: BookMarked, category: "Personal" },
  { slug: "documents", number: 26, title: "Document Management", subtitle: "Upload, categorise & AI OCR scanner.", icon: FileText, category: "Platform" },
  { slug: "reports", number: 27, title: "Reports & Analytics", subtitle: "Attendance, exams & AI predictive analytics.", icon: BarChart3, category: "Intelligence" },
  { slug: "notifications", number: 28, title: "Notifications Center", subtitle: "School, academic, student & parent alerts.", icon: Bell, category: "Communication" },
  { slug: "security", number: 29, title: "Security & Privacy", subtitle: "Password, sessions, 2FA & device management.", icon: Lock, category: "Platform" },
  { slug: "settings", number: 30, title: "Settings", subtitle: "Profile, notifications, language, theme & a11y.", icon: Settings, category: "Platform" },
];

export const TEACHER_MODULE_BY_SLUG: Record<string, TeacherModuleDef> =
  Object.fromEntries(TEACHER_MODULES.map((m) => [m.slug, m]));
