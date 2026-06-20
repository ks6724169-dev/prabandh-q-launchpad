import {
  LayoutDashboard, GraduationCap, Users, CalendarCheck, BookOpen, FileCheck2, NotebookPen,
  CalendarRange, Wallet, Calculator, UserCog, Briefcase, BadgeDollarSign, HeartHandshake,
  MessagesSquare, Bus, BedDouble, Library, Boxes, HeartPulse, PartyPopper, ShieldCheck,
  Lock, BarChart3, FileText, Smartphone, Globe2, Brain, Plug, Building2, type LucideIcon,
} from "lucide-react";
import type { ModuleFeature } from "@/components/module-stub";

export type ModuleDef = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  category: "Core" | "Academics" | "Finance" | "People" | "Operations" | "Intelligence" | "Platform";
  features: ModuleFeature[];
};

export const MODULES: ModuleDef[] = [
  { slug: "dashboard", number: 1, title: "Dashboard", subtitle: "School overview & AI insights dashboard.", icon: LayoutDashboard, category: "Core",
    features: [{ label: "School Overview" }, { label: "Live KPIs" }, { label: "AI Insights Dashboard", ai: true }, { label: "Smart Alerts", ai: true }] },
  { slug: "admissions-mgmt", number: 2, title: "Admission Management", subtitle: "Workflow, document verification, AI forecasts & OCR.", icon: FileCheck2, category: "Academics",
    features: [{ label: "Admission Workflow" }, { label: "Document Verification" }, { label: "AI Admission Forecast", ai: true }, { label: "AI Document OCR", ai: true }] },
  { slug: "students", number: 3, title: "Student Management", subtitle: "Profiles, promotion, AI performance prediction.", icon: GraduationCap, category: "People",
    features: [{ label: "Student Profiles" }, { label: "Promotion Engine" }, { label: "AI Performance Prediction", ai: true }, { label: "At-Risk Detection", ai: true }] },
  { slug: "attendance-mgmt", number: 4, title: "Attendance Management", subtitle: "Daily/subject, Biometric/QR/RFID, AI absentee prediction.", icon: CalendarCheck, category: "Operations",
    features: [{ label: "Daily & Subject-wise" }, { label: "Biometric / QR / RFID" }, { label: "AI Absentee Prediction", ai: true }, { label: "Parent Auto-Notify" }] },
  { slug: "academics", number: 5, title: "Academic Management", subtitle: "Classes, sections, syllabus tracking, AI lesson plans.", icon: BookOpen, category: "Academics",
    features: [{ label: "Classes & Sections" }, { label: "Syllabus Tracking" }, { label: "AI Lesson Plans", ai: true }, { label: "Curriculum Mapping" }] },
  { slug: "exams", number: 6, title: "Examination Management", subtitle: "Seating plan, marks entry, AI question paper generator.", icon: NotebookPen, category: "Academics",
    features: [{ label: "Seating Plan" }, { label: "Marks Entry" }, { label: "AI Question Paper", ai: true }, { label: "AI MCQ Generator", ai: true }] },
  { slug: "homework", number: 7, title: "Homework & Assignment", subtitle: "Submission tracking with AI homework generator.", icon: NotebookPen, category: "Academics",
    features: [{ label: "Submission Tracking" }, { label: "Plagiarism Hints", ai: true }, { label: "AI Homework Generator", ai: true }, { label: "Auto Grading", ai: true }] },
  { slug: "timetable", number: 8, title: "Timetable Management", subtitle: "Class/teacher, AI auto generator & conflict detection.", icon: CalendarRange, category: "Academics",
    features: [{ label: "Class Timetable" }, { label: "Teacher Timetable" }, { label: "AI Auto Generator", ai: true }, { label: "Conflict Detection", ai: true }] },
  { slug: "fees-mgmt", number: 9, title: "Fee Management", subtitle: "Structures, online payments, AI defaulter prediction.", icon: Wallet, category: "Finance",
    features: [{ label: "Fee Structures" }, { label: "Online Payments" }, { label: "AI Defaulter Prediction", ai: true }, { label: "Reminders" }] },
  { slug: "accounting", number: 10, title: "Accounting & Finance", subtitle: "Ledger, cashbook, GST, AI expense forecasting.", icon: Calculator, category: "Finance",
    features: [{ label: "Ledger & Cashbook" }, { label: "GST" }, { label: "AI Expense Analysis", ai: true }, { label: "Forecasting", ai: true }] },
  { slug: "teachers", number: 11, title: "Teacher Management", subtitle: "Profiles, payroll, AI performance evaluation.", icon: UserCog, category: "People",
    features: [{ label: "Profiles" }, { label: "Payroll Hooks" }, { label: "AI Performance Evaluation", ai: true }, { label: "Feedback Loop" }] },
  { slug: "staff-mgmt", number: 12, title: "Staff Management", subtitle: "Non-teaching staff, duty allocation, AI productivity.", icon: Briefcase, category: "People",
    features: [{ label: "Non-Teaching Staff" }, { label: "Duty Allocation" }, { label: "AI Productivity Analytics", ai: true }, { label: "Shift Planning" }] },
  { slug: "payroll", number: 13, title: "Payroll Management", subtitle: "Salary, payslips, PF/ESI, AI payroll analytics.", icon: BadgeDollarSign, category: "Finance",
    features: [{ label: "Salary Generation" }, { label: "Payslips" }, { label: "PF / ESI" }, { label: "AI Payroll Analytics", ai: true }] },
  { slug: "parents", number: 14, title: "Parent Management", subtitle: "Profiles & AI parent support chatbot.", icon: HeartHandshake, category: "People",
    features: [{ label: "Parent Profiles" }, { label: "Communication Log" }, { label: "AI Support Chatbot", ai: true }, { label: "Meeting Scheduler" }] },
  { slug: "communication", number: 15, title: "Communication Center", subtitle: "SMS, Email, WhatsApp + AI notice generator.", icon: MessagesSquare, category: "Operations",
    features: [{ label: "SMS / Email / WhatsApp" }, { label: "Broadcast Lists" }, { label: "AI Notice Generator", ai: true }, { label: "Templates" }] },
  { slug: "transport", number: 16, title: "Transport Management", subtitle: "Routes, GPS, AI route optimization & delay prediction.", icon: Bus, category: "Operations",
    features: [{ label: "Routes & Stops" }, { label: "GPS Tracking" }, { label: "AI Route Optimization", ai: true }, { label: "Delay Prediction", ai: true }] },
  { slug: "hostel", number: 17, title: "Hostel Management", subtitle: "Room allocation, fees, AI occupancy analysis.", icon: BedDouble, category: "Operations",
    features: [{ label: "Room Allocation" }, { label: "Hostel Fees" }, { label: "AI Occupancy Analysis", ai: true }, { label: "Mess Planner" }] },
  { slug: "library", number: 18, title: "Library Management", subtitle: "Catalog, issue/return, AI book recommendations.", icon: Library, category: "Academics",
    features: [{ label: "Book Catalog" }, { label: "Issue / Return" }, { label: "AI Recommendations", ai: true }, { label: "Reading Insights", ai: true }] },
  { slug: "inventory", number: 19, title: "Inventory & Assets", subtitle: "Asset tracking, stock, AI stock prediction.", icon: Boxes, category: "Operations",
    features: [{ label: "Asset Tracking" }, { label: "Stock Management" }, { label: "AI Stock Prediction", ai: true }, { label: "Procurement" }] },
  { slug: "health", number: 20, title: "Health & Medical Records", subtitle: "Medical history with AI health risk alerts.", icon: HeartPulse, category: "Operations",
    features: [{ label: "Medical History" }, { label: "Vaccination Records" }, { label: "AI Health Risk Alerts", ai: true }, { label: "Infirmary Log" }] },
  { slug: "events", number: 21, title: "Event Management", subtitle: "School events with AI planning suggestions.", icon: PartyPopper, category: "Operations",
    features: [{ label: "Event Calendar" }, { label: "RSVPs" }, { label: "AI Planning Suggestions", ai: true }, { label: "Budgeting" }] },
  { slug: "visitors", number: 22, title: "Visitor Management", subtitle: "Visitor entry, gate pass, AI security alerts.", icon: ShieldCheck, category: "Operations",
    features: [{ label: "Visitor Entry" }, { label: "Gate Pass" }, { label: "AI Security Alerts", ai: true }, { label: "Photo ID Capture" }] },
  { slug: "security", number: 23, title: "Security & Compliance", subtitle: "Roles, audit logs, AI suspicious activity detection.", icon: Lock, category: "Platform",
    features: [{ label: "Role Permissions" }, { label: "Audit Logs" }, { label: "AI Suspicious Activity", ai: true }, { label: "Compliance Reports" }] },
  { slug: "reports", number: 24, title: "Reports & Analytics", subtitle: "Academic, financial & AI predictive analytics.", icon: BarChart3, category: "Intelligence",
    features: [{ label: "Academic Reports" }, { label: "Financial Reports" }, { label: "AI Predictive Analytics", ai: true }, { label: "Smart Recommendations", ai: true }] },
  { slug: "documents", number: 25, title: "Document Management", subtitle: "Digital signatures, AI OCR scanner & auto-categorization.", icon: FileText, category: "Platform",
    features: [{ label: "Digital Signatures" }, { label: "Vault Storage" }, { label: "AI OCR Scanner", ai: true }, { label: "Auto Categorization", ai: true }] },
  { slug: "mobile-app", number: 26, title: "Mobile App Control", subtitle: "App settings & user access control.", icon: Smartphone, category: "Platform",
    features: [{ label: "App Settings" }, { label: "Feature Flags" }, { label: "User Access Control" }, { label: "Push Notifications" }] },
  { slug: "cms", number: 27, title: "Website CMS", subtitle: "School website, news & AI content generator.", icon: Globe2, category: "Platform",
    features: [{ label: "Pages & News" }, { label: "Media Library" }, { label: "AI Content Generator", ai: true }, { label: "SEO Helper", ai: true }] },
  { slug: "ai-command", number: 28, title: "AI Command Center", subtitle: "Assistant, data search, report gen, voice, consultant, counselor.", icon: Brain, category: "Intelligence",
    features: [
      { label: "AI School Assistant", ai: true }, { label: "AI Data Search", ai: true },
      { label: "AI Report Generator", ai: true }, { label: "AI Voice Assistant", ai: true },
      { label: "AI School Consultant", ai: true }, { label: "AI Admission Counselor", ai: true },
      { label: "AI Career Guidance", ai: true }, { label: "AI Meeting Summary", ai: true },
      { label: "AI Smart Search", ai: true },
    ] },
  { slug: "integrations", number: 29, title: "Integrations", subtitle: "Payments, Biometric, GPS, SMS, Email, WhatsApp, Meet, Zoom.", icon: Plug, category: "Platform",
    features: [{ label: "Payment Gateway" }, { label: "Biometric & GPS" }, { label: "SMS / Email / WhatsApp" }, { label: "Google Meet & Zoom" }] },
  { slug: "multi-school", number: 30, title: "Multi-School & Franchise", subtitle: "Branch management, centralized monitoring, AI comparisons.", icon: Building2, category: "Platform",
    features: [{ label: "Branch Management" }, { label: "Centralized Monitoring" }, { label: "AI Branch Performance", ai: true }, { label: "Franchise Console" }] },
];

export const MODULE_BY_SLUG: Record<string, ModuleDef> =
  Object.fromEntries(MODULES.map((m) => [m.slug, m]));
