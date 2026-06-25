import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  GraduationCap, Users, Briefcase, Search, Filter, Download, Plus, Eye, Pencil, Trash2,
  Upload, Printer, FileSpreadsheet, ChevronRight, Sparkles, UserCheck, UserX, TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/records")({
  head: () => ({ meta: [{ title: "Records · EduSmart ERP" }] }),
  component: RecordsPage,
});

type Tab = "teachers" | "students" | "staff";

type Teacher = {
  id: string; name: string; gender: "Male" | "Female"; mobile: string; email: string;
  subject: string; department: string; qualification: string; experience: number;
  joiningDate: string; salary: number; status: "Active" | "Inactive";
};
type Student = {
  id: string; admissionNo: string; name: string; father: string; mother: string;
  class: string; section: string; roll: number; mobile: string; gender: "Male" | "Female";
  dob: string; fee: "Paid" | "Pending" | "Overdue"; attendance: number; status: "Active" | "Inactive";
};
type StaffM = {
  id: string; name: string; designation: string; department: string; mobile: string;
  email: string; salary: number; joiningDate: string; status: "Active" | "Inactive";
};

const DEPARTMENTS = ["Computer Science", "Mathematics", "Science", "English", "Social Science", "Commerce", "Languages", "Arts"];
const SUBJECTS = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Commerce", "Hindi"];
const DESIGNATIONS = ["Office Manager", "Accountant", "Librarian", "Lab Assistant", "Receptionist", "Security", "Driver", "Cleaner", "Nurse", "Counsellor"];
const STAFF_DEPTS = ["Administration", "Accounts", "Library", "Laboratory", "Reception", "Security", "Transport", "Housekeeping", "Medical"];
const CLASSES = ["Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"];
const SECTIONS = ["A","B","C","D"];

const FIRST_M = ["Rahul","Amit","Vikram","Sandeep","Arjun","Rohan","Karan","Aditya","Manish","Suresh","Ravi","Nikhil","Deepak","Vijay","Ankit"];
const FIRST_F = ["Priya","Sunita","Neha","Anjali","Pooja","Kavita","Meera","Ritu","Sneha","Shreya","Divya","Geeta","Nisha","Anita","Rekha"];
const LAST = ["Sharma","Verma","Singh","Patel","Joshi","Gupta","Kumar","Mehta","Reddy","Iyer","Nair","Khan","Ahmed","Das","Pandey"];

function rand<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function gender(i: number): "Male" | "Female" { return i % 2 === 0 ? "Male" : "Female"; }
function nameAt(i: number) {
  const g = gender(i);
  const first = g === "Male" ? rand(FIRST_M, i) : rand(FIRST_F, Math.floor(i / 2));
  return { name: `${first} ${rand(LAST, i + 1)}`, gender: g };
}

const TEACHERS: Teacher[] = Array.from({ length: 24 }, (_, i) => {
  const { name, gender: g } = nameAt(i);
  return {
    id: `T${String(i + 1).padStart(3, "0")}`,
    name, gender: g,
    mobile: `98765${String(43210 + i).slice(-5)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@school.com`,
    subject: rand(SUBJECTS, i),
    department: rand(DEPARTMENTS, i),
    qualification: rand(["M.Tech","M.Sc, B.Ed","MA, B.Ed","M.Com, B.Ed","Ph.D"], i),
    experience: 2 + (i % 14),
    joiningDate: `20${15 + (i % 9)}-0${1 + (i % 9)}-1${i % 9}`,
    salary: 35000 + (i % 6) * 5000,
    status: i % 11 === 0 ? "Inactive" : "Active",
  };
});

const STUDENTS: Student[] = Array.from({ length: 30 }, (_, i) => {
  const { name, gender: g } = nameAt(i + 3);
  const father = `${rand(FIRST_M, i + 4)} ${name.split(" ")[1]}`;
  const mother = `${rand(FIRST_F, i + 6)} ${name.split(" ")[1]}`;
  return {
    id: `S${String(i + 1).padStart(3, "0")}`,
    admissionNo: `ADM${2024}${String(1001 + i).slice(-4)}`,
    name, father, mother,
    class: rand(CLASSES, i + 2),
    section: rand(SECTIONS, i),
    roll: 1 + (i % 35),
    mobile: `98760${String(11111 + i).slice(-5)}`,
    gender: g,
    dob: `20${10 + (i % 8)}-0${1 + (i % 9)}-${10 + (i % 18)}`,
    fee: (["Paid","Pending","Overdue","Paid","Paid"] as const)[i % 5],
    attendance: 70 + (i % 30),
    status: i % 13 === 0 ? "Inactive" : "Active",
  };
});

const STAFF: StaffM[] = Array.from({ length: 18 }, (_, i) => {
  const { name } = nameAt(i + 7);
  return {
    id: `E${String(i + 1).padStart(3, "0")}`,
    name,
    designation: rand(DESIGNATIONS, i),
    department: rand(STAFF_DEPTS, i),
    mobile: `97654${String(32100 + i).slice(-5)}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@school.com`,
    salary: 18000 + (i % 8) * 3000,
    joiningDate: `20${17 + (i % 7)}-0${1 + (i % 9)}-0${1 + (i % 8)}`,
    status: i % 9 === 0 ? "Inactive" : "Active",
  };
});

const AVATAR_TONES = [
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
];
function initials(name: string) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}
function Avatar({ name, idx }: { name: string; idx: number }) {
  return (
    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${AVATAR_TONES[idx % AVATAR_TONES.length]} text-xs font-bold text-white shadow`}>
      {initials(name)}
    </div>
  );
}

function StatusBadge({ s }: { s: string }) {
  const tone =
    /active|paid/i.test(s) ? "bg-emerald-100 text-emerald-700" :
    /inactive|overdue/i.test(s) ? "bg-rose-100 text-rose-700" :
    "bg-amber-100 text-amber-700";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{s}</span>;
}

function StatCard({ icon: Icon, label, value, sub, tone }: { icon: any; label: string; value: string | number; sub?: string; tone: string }) {
  return (
    <Card className="border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="font-display text-3xl font-extrabold tracking-tight text-slate-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </Card>
  );
}

function RecordsPage() {
  const [tab, setTab] = useState<Tab>("teachers");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">Records</h1>
          <p className="text-sm text-slate-500">Manage all Teachers, Students and Staff records</p>
        </div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/admin" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-slate-700">Records</span>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Category sidebar */}
        <Card className="h-fit border-slate-200/80 p-5 shadow-sm">
          <h2 className="font-display text-base font-bold text-slate-900">Record Categories</h2>
          <div className="mt-4 space-y-3">
            <CategoryCard active={tab === "teachers"} onClick={() => setTab("teachers")}
              icon={GraduationCap} tone="bg-violet-100 text-violet-600" label="All Teachers"
              sub="Manage all teacher records" count={TEACHERS.length} countTone="bg-violet-100 text-violet-700" />
            <CategoryCard active={tab === "students"} onClick={() => setTab("students")}
              icon={Users} tone="bg-emerald-100 text-emerald-600" label="All Students"
              sub="Manage all student records" count={STUDENTS.length} countTone="bg-emerald-100 text-emerald-700" />
            <CategoryCard active={tab === "staff"} onClick={() => setTab("staff")}
              icon={Briefcase} tone="bg-amber-100 text-amber-600" label="All Staff"
              sub="Manage all staff records" count={STAFF.length} countTone="bg-amber-100 text-amber-700" />
          </div>
        </Card>

        {/* Right content */}
        <div className="min-w-0 space-y-5">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
            <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-slate-200 bg-transparent p-0">
              <TabTrig value="teachers">All Teachers</TabTrig>
              <TabTrig value="students">All Students</TabTrig>
              <TabTrig value="staff">All Staff</TabTrig>
            </TabsList>
          </Tabs>

          {tab === "teachers" && <TeachersPanel />}
          {tab === "students" && <StudentsPanel />}
          {tab === "staff" && <StaffPanel />}
        </div>
      </div>
    </div>
  );
}

function TabTrig({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsTrigger
      value={value}
      className="relative rounded-none border-0 bg-transparent px-1 pb-3 pt-2 text-sm font-semibold text-slate-500 shadow-none transition data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-blue-600 after:transition after:content-[''] data-[state=active]:after:scale-x-100"
    >
      {children}
    </TabsTrigger>
  );
}

function CategoryCard({
  active, onClick, icon: Icon, tone, label, sub, count, countTone,
}: { active: boolean; onClick: () => void; icon: any; tone: string; label: string; sub: string; count: number; countTone: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
        active ? "border-blue-200 bg-blue-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="truncate text-xs text-slate-500">{sub}</p>
      </div>
      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${countTone}`}>{count.toLocaleString()}</span>
    </button>
  );
}

/* ============ TEACHERS ============ */
function TeachersPanel() {
  const [rows, setRows] = useState(TEACHERS);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("__all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Teacher | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    (dept === "__all" || r.department === dept) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
  ), [rows, search, dept]);

  const males = rows.filter(r => r.gender === "Male").length;
  const females = rows.filter(r => r.gender === "Female").length;
  const depts = new Set(rows.map(r => r.department)).size;
  const active = rows.filter(r => r.status === "Active").length;

  const toggleAll = (v: boolean) => setSelected(v ? new Set(filtered.map(r => r.id)) : new Set());
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const remove = (id: string) => {
    setRows(prev => prev.filter(r => r.id !== id));
    toast.success("Teacher record removed");
  };
  const bulkDelete = () => {
    setRows(prev => prev.filter(r => !selected.has(r.id)));
    toast.success(`${selected.size} teacher(s) removed`);
    setSelected(new Set());
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Total Teachers" value={rows.length}
          sub={`Active Teachers ${active} (${rows.length ? Math.round((active/rows.length)*100):0}%)`}
          tone="bg-violet-100 text-violet-600" />
        <StatCard icon={UserCheck} label="Male Teachers" value={males}
          sub={`${rows.length ? Math.round((males/rows.length)*100):0}%`} tone="bg-blue-100 text-blue-600" />
        <StatCard icon={UserX} label="Female Teachers" value={females}
          sub={`${rows.length ? Math.round((females/rows.length)*100):0}%`} tone="bg-rose-100 text-rose-600" />
        <StatCard icon={Briefcase} label="Departments" value={depts} sub="Total Departments" tone="bg-amber-100 text-amber-600" />
      </div>

      <Card className="border-slate-200/80 p-4 shadow-sm">
        <Toolbar
          search={search} onSearch={setSearch} placeholder="Search teachers..."
          filterLabel="All Departments" filterValue={dept} onFilter={setDept}
          options={DEPARTMENTS} addLabel="Add Teacher" onAdd={() => setOpen(true)}
          selectedCount={selected.size} onBulkDelete={bulkDelete}
        />

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                <TableHead className="w-10">
                  <Checkbox checked={selected.size > 0 && selected.size === filtered.length}
                    onCheckedChange={(v) => toggleAll(Boolean(v))} />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Teacher Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Qualification</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="py-10 text-center text-sm text-slate-500">No teachers match.</TableCell></TableRow>
              ) : filtered.map((r, i) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggleOne(r.id)} /></TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">{r.id}</TableCell>
                  <TableCell><Avatar name={r.name} idx={i} /></TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-800">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.subject}</div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="bg-violet-100 text-violet-700 hover:bg-violet-100">{r.department}</Badge></TableCell>
                  <TableCell className="text-sm">{r.qualification}</TableCell>
                  <TableCell className="text-sm">{r.experience} Years</TableCell>
                  <TableCell className="text-sm text-slate-600">{r.email}</TableCell>
                  <TableCell className="font-mono text-xs">{r.mobile}</TableCell>
                  <TableCell><StatusBadge s={r.status} /></TableCell>
                  <TableCell><RowActions onView={() => setViewing(r)} onRemove={() => remove(r.id)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TableFooter total={rows.length} shown={filtered.length} />
      </Card>

      <AddTeacherDialog open={open} onOpenChange={setOpen} onSave={(t) => { setRows(prev => [t, ...prev]); toast.success("Teacher added"); }} nextSeq={rows.length + 1} />

      <ProfileDialog open={!!viewing} onClose={() => setViewing(null)} title="Teacher Profile"
        avatar={viewing?.name ?? ""} fields={viewing ? [
          ["Employee ID", viewing.id], ["Name", viewing.name], ["Gender", viewing.gender],
          ["Department", viewing.department], ["Subject", viewing.subject],
          ["Qualification", viewing.qualification], ["Experience", `${viewing.experience} Years`],
          ["Joining Date", viewing.joiningDate], ["Salary", `₹${viewing.salary.toLocaleString("en-IN")}`],
          ["Mobile", viewing.mobile], ["Email", viewing.email], ["Status", viewing.status],
        ] : []} />
    </>
  );
}

/* ============ STUDENTS ============ */
function StudentsPanel() {
  const [rows, setRows] = useState(STUDENTS);
  const [search, setSearch] = useState("");
  const [cls, setCls] = useState("__all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<Student | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    (cls === "__all" || r.class === cls) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.admissionNo.toLowerCase().includes(search.toLowerCase()))
  ), [rows, search, cls]);

  const active = rows.filter(r => r.status === "Active").length;
  const males = rows.filter(r => r.gender === "Male").length;
  const females = rows.filter(r => r.gender === "Female").length;
  const feePending = rows.filter(r => r.fee !== "Paid").length;

  const remove = (id: string) => { setRows(p => p.filter(r => r.id !== id)); toast.success("Student removed"); };
  const bulkDelete = () => { setRows(p => p.filter(r => !selected.has(r.id))); toast.success(`${selected.size} student(s) removed`); setSelected(new Set()); };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Students" value={rows.length} sub={`Active ${active}`} tone="bg-emerald-100 text-emerald-600" />
        <StatCard icon={UserCheck} label="Male Students" value={males} sub={`${rows.length ? Math.round((males/rows.length)*100):0}%`} tone="bg-blue-100 text-blue-600" />
        <StatCard icon={UserX} label="Female Students" value={females} sub={`${rows.length ? Math.round((females/rows.length)*100):0}%`} tone="bg-rose-100 text-rose-600" />
        <StatCard icon={TrendingUp} label="Fee Pending" value={feePending} sub="Needs follow-up" tone="bg-amber-100 text-amber-600" />
      </div>

      <Card className="border-slate-200/80 p-4 shadow-sm">
        <Toolbar
          search={search} onSearch={setSearch} placeholder="Search students..."
          filterLabel="All Classes" filterValue={cls} onFilter={setCls}
          options={CLASSES.map(c => `${c}`)} addLabel="Add Student" onAdd={() => setOpen(true)}
          selectedCount={selected.size} onBulkDelete={bulkDelete}
        />

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                <TableHead className="w-10">
                  <Checkbox checked={selected.size > 0 && selected.size === filtered.length}
                    onCheckedChange={(v) => setSelected(v ? new Set(filtered.map(r => r.id)) : new Set())} />
                </TableHead>
                <TableHead>Admission</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Roll</TableHead>
                <TableHead>Father</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Attd.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={13} className="py-10 text-center text-sm text-slate-500">No students match.</TableCell></TableRow>
              ) : filtered.map((r, i) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => {
                    const n = new Set(selected); n.has(r.id) ? n.delete(r.id) : n.add(r.id); setSelected(n);
                  }} /></TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">{r.admissionNo}</TableCell>
                  <TableCell><Avatar name={r.name} idx={i + 2} /></TableCell>
                  <TableCell className="font-semibold text-slate-800">{r.name}</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Class {r.class}</Badge></TableCell>
                  <TableCell>{r.section}</TableCell>
                  <TableCell>{r.roll}</TableCell>
                  <TableCell className="text-sm">{r.father}</TableCell>
                  <TableCell className="font-mono text-xs">{r.mobile}</TableCell>
                  <TableCell><StatusBadge s={r.fee} /></TableCell>
                  <TableCell className="text-sm font-semibold">{r.attendance}%</TableCell>
                  <TableCell><StatusBadge s={r.status} /></TableCell>
                  <TableCell><RowActions onView={() => setViewing(r)} onRemove={() => remove(r.id)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TableFooter total={rows.length} shown={filtered.length} />
      </Card>

      <AddStudentDialog open={open} onOpenChange={setOpen} onSave={(s) => { setRows(p => [s, ...p]); toast.success("Student added"); }} nextSeq={rows.length + 1} />

      <ProfileDialog open={!!viewing} onClose={() => setViewing(null)} title="Student Profile"
        avatar={viewing?.name ?? ""} fields={viewing ? [
          ["Admission No", viewing.admissionNo], ["Name", viewing.name],
          ["Class", `${viewing.class} - ${viewing.section}`], ["Roll No", String(viewing.roll)],
          ["Father", viewing.father], ["Mother", viewing.mother],
          ["Gender", viewing.gender], ["DOB", viewing.dob], ["Mobile", viewing.mobile],
          ["Fee Status", viewing.fee], ["Attendance", `${viewing.attendance}%`], ["Status", viewing.status],
        ] : []} />
    </>
  );
}

/* ============ STAFF ============ */
function StaffPanel() {
  const [rows, setRows] = useState(STAFF);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("__all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<StaffM | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    (dept === "__all" || r.department === dept) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()))
  ), [rows, search, dept]);

  const active = rows.filter(r => r.status === "Active").length;
  const depts = new Set(rows.map(r => r.department)).size;
  const totalSalary = rows.reduce((a, r) => a + r.salary, 0);

  const remove = (id: string) => { setRows(p => p.filter(r => r.id !== id)); toast.success("Staff removed"); };
  const bulkDelete = () => { setRows(p => p.filter(r => !selected.has(r.id))); toast.success(`${selected.size} staff removed`); setSelected(new Set()); };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Total Staff" value={rows.length} sub={`Active ${active}`} tone="bg-amber-100 text-amber-600" />
        <StatCard icon={UserCheck} label="Active" value={active} sub={`${rows.length ? Math.round((active/rows.length)*100):0}%`} tone="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Users} label="Departments" value={depts} sub="Operational depts." tone="bg-blue-100 text-blue-600" />
        <StatCard icon={TrendingUp} label="Monthly Salary" value={`₹${totalSalary.toLocaleString("en-IN")}`} sub="Total payroll" tone="bg-violet-100 text-violet-600" />
      </div>

      <Card className="border-slate-200/80 p-4 shadow-sm">
        <Toolbar
          search={search} onSearch={setSearch} placeholder="Search staff..."
          filterLabel="All Departments" filterValue={dept} onFilter={setDept}
          options={STAFF_DEPTS} addLabel="Add Staff" onAdd={() => setOpen(true)}
          selectedCount={selected.size} onBulkDelete={bulkDelete}
        />

        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                <TableHead className="w-10">
                  <Checkbox checked={selected.size > 0 && selected.size === filtered.length}
                    onCheckedChange={(v) => setSelected(v ? new Set(filtered.map(r => r.id)) : new Set())} />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Photo</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Joining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={12} className="py-10 text-center text-sm text-slate-500">No staff match.</TableCell></TableRow>
              ) : filtered.map((r, i) => (
                <TableRow key={r.id} className="hover:bg-slate-50/60">
                  <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => {
                    const n = new Set(selected); n.has(r.id) ? n.delete(r.id) : n.add(r.id); setSelected(n);
                  }} /></TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">{r.id}</TableCell>
                  <TableCell><Avatar name={r.name} idx={i + 4} /></TableCell>
                  <TableCell className="font-semibold text-slate-800">{r.name}</TableCell>
                  <TableCell className="text-sm">{r.designation}</TableCell>
                  <TableCell><Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">{r.department}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{r.mobile}</TableCell>
                  <TableCell className="text-sm text-slate-600">{r.email}</TableCell>
                  <TableCell className="font-semibold">₹{r.salary.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-sm">{r.joiningDate}</TableCell>
                  <TableCell><StatusBadge s={r.status} /></TableCell>
                  <TableCell><RowActions onView={() => setViewing(r)} onRemove={() => remove(r.id)} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TableFooter total={rows.length} shown={filtered.length} />
      </Card>

      <AddStaffDialog open={open} onOpenChange={setOpen} onSave={(s) => { setRows(p => [s, ...p]); toast.success("Staff added"); }} nextSeq={rows.length + 1} />

      <ProfileDialog open={!!viewing} onClose={() => setViewing(null)} title="Staff Profile"
        avatar={viewing?.name ?? ""} fields={viewing ? [
          ["Employee ID", viewing.id], ["Name", viewing.name],
          ["Designation", viewing.designation], ["Department", viewing.department],
          ["Mobile", viewing.mobile], ["Email", viewing.email],
          ["Salary", `₹${viewing.salary.toLocaleString("en-IN")}`],
          ["Joining Date", viewing.joiningDate], ["Status", viewing.status],
        ] : []} />
    </>
  );
}

/* ============ Shared ============ */
function Toolbar({
  search, onSearch, placeholder, filterLabel, filterValue, onFilter, options,
  addLabel, onAdd, selectedCount, onBulkDelete,
}: {
  search: string; onSearch: (v: string) => void; placeholder: string;
  filterLabel: string; filterValue: string; onFilter: (v: string) => void; options: string[];
  addLabel: string; onAdd: () => void; selectedCount: number; onBulkDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <Select value={filterValue} onValueChange={onFilter}>
          <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder={filterLabel} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">{filterLabel}</SelectItem>
            {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} className="pl-9" />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selectedCount > 0 && (
          <Button variant="outline" onClick={onBulkDelete} className="gap-1.5 text-rose-600 hover:text-rose-700">
            <Trash2 className="h-4 w-4" /> Delete ({selectedCount})
          </Button>
        )}
        <Button variant="outline" className="gap-1.5" onClick={() => toast.info("AI Smart Search coming up…")}>
          <Sparkles className="h-4 w-4 text-violet-600" /> AI Search
        </Button>
        <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Import dialog opened")}><Upload className="h-4 w-4" /> Import</Button>
        <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Export started")}><Download className="h-4 w-4" /> Export</Button>
        <Button variant="outline" className="gap-1.5" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
        <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Report generated")}><FileSpreadsheet className="h-4 w-4" /> Report</Button>
        <Button variant="outline" className="gap-1.5"><Filter className="h-4 w-4" /> Filter</Button>
        <Button onClick={onAdd} className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> {addLabel}
        </Button>
      </div>
    </div>
  );
}

function RowActions({ onView, onRemove }: { onView: () => void; onRemove: () => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon" onClick={onView} className="h-8 w-8 text-blue-600 hover:bg-blue-50"><Eye className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={() => toast.info("Edit form opened")} className="h-8 w-8 text-amber-600 hover:bg-amber-50"><Pencil className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" onClick={onRemove} className="h-8 w-8 text-rose-600 hover:bg-rose-50"><Trash2 className="h-4 w-4" /></Button>
    </div>
  );
}

function TableFooter({ total, shown }: { total: number; shown: number }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
      <span>Showing {shown} of {total} entries</span>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled>‹</Button>
        <Button size="sm" className="h-8 w-8 bg-blue-600 text-white hover:bg-blue-700">1</Button>
        <Button variant="outline" size="sm" className="h-8 w-8">2</Button>
        <Button variant="outline" size="sm" className="h-8 w-8">3</Button>
        <Button variant="outline" size="sm">›</Button>
      </div>
    </div>
  );
}

function ProfileDialog({ open, onClose, title, avatar, fields }: {
  open: boolean; onClose: () => void; title: string; avatar: string; fields: [string, string][];
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        {avatar && (
          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow">{initials(avatar)}</div>
            <div>
              <p className="font-display text-lg font-bold text-slate-900">{avatar}</p>
              <p className="text-xs text-slate-500">Complete record details</p>
            </div>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(([k, v]) => (
            <div key={k} className="rounded-lg border border-slate-200 p-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{k}</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">{v}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" /> Print</Button>
          <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============ Add Dialogs ============ */
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      {children}
    </div>
  );
}

function AddTeacherDialog({ open, onOpenChange, onSave, nextSeq }:
  { open: boolean; onOpenChange: (v: boolean) => void; onSave: (t: Teacher) => void; nextSeq: number }) {
  const [f, setF] = useState<any>({ gender: "Male", department: DEPARTMENTS[0], subject: SUBJECTS[0], qualification: "M.Sc, B.Ed" });
  const set = (k: string, v: any) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.name || !f.mobile || !f.email) { toast.error("Name, mobile and email required"); return; }
    onSave({
      id: `T${String(nextSeq).padStart(3, "0")}`,
      name: f.name, gender: f.gender, mobile: f.mobile, email: f.email,
      subject: f.subject, department: f.department, qualification: f.qualification,
      experience: Number(f.experience) || 1, joiningDate: f.joiningDate || new Date().toISOString().slice(0, 10),
      salary: Number(f.salary) || 30000, status: "Active",
    });
    setF({ gender: "Male", department: DEPARTMENTS[0], subject: SUBJECTS[0], qualification: "M.Sc, B.Ed" });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Add Teacher</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <FieldRow>
            <Field label="Teacher Name *"><Input value={f.name ?? ""} onChange={e => set("name", e.target.value)} /></Field>
            <Field label="Gender"><Select value={f.gender} onValueChange={v => set("gender", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Mobile *"><Input value={f.mobile ?? ""} onChange={e => set("mobile", e.target.value)} /></Field>
            <Field label="Email *"><Input type="email" value={f.email ?? ""} onChange={e => set("email", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Department"><Select value={f.department} onValueChange={v => set("department", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Subject"><Select value={f.subject} onValueChange={v => set("subject", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Qualification"><Input value={f.qualification ?? ""} onChange={e => set("qualification", e.target.value)} /></Field>
            <Field label="Experience (years)"><Input type="number" value={f.experience ?? ""} onChange={e => set("experience", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Joining Date"><Input type="date" value={f.joiningDate ?? ""} onChange={e => set("joiningDate", e.target.value)} /></Field>
            <Field label="Monthly Salary (₹)"><Input type="number" value={f.salary ?? ""} onChange={e => set("salary", e.target.value)} /></Field>
          </FieldRow>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Save Teacher</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddStudentDialog({ open, onOpenChange, onSave, nextSeq }:
  { open: boolean; onOpenChange: (v: boolean) => void; onSave: (s: Student) => void; nextSeq: number }) {
  const [f, setF] = useState<any>({ gender: "Male", class: "10", section: "A", fee: "Paid" });
  const set = (k: string, v: any) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.name || !f.father) { toast.error("Name and father name required"); return; }
    onSave({
      id: `S${String(nextSeq).padStart(3, "0")}`,
      admissionNo: `ADM2024${String(2000 + nextSeq).slice(-4)}`,
      name: f.name, father: f.father, mother: f.mother ?? "—",
      class: f.class, section: f.section, roll: Number(f.roll) || nextSeq,
      mobile: f.mobile ?? "—", gender: f.gender, dob: f.dob ?? "2012-01-01",
      fee: f.fee, attendance: 90, status: "Active",
    });
    setF({ gender: "Male", class: "10", section: "A", fee: "Paid" });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Add Student</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <FieldRow>
            <Field label="Student Name *"><Input value={f.name ?? ""} onChange={e => set("name", e.target.value)} /></Field>
            <Field label="Gender"><Select value={f.gender} onValueChange={v => set("gender", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Father Name *"><Input value={f.father ?? ""} onChange={e => set("father", e.target.value)} /></Field>
            <Field label="Mother Name"><Input value={f.mother ?? ""} onChange={e => set("mother", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Class"><Select value={f.class} onValueChange={v => set("class", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Section"><Select value={f.section} onValueChange={v => set("section", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Roll No"><Input type="number" value={f.roll ?? ""} onChange={e => set("roll", e.target.value)} /></Field>
            <Field label="Mobile"><Input value={f.mobile ?? ""} onChange={e => set("mobile", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="DOB"><Input type="date" value={f.dob ?? ""} onChange={e => set("dob", e.target.value)} /></Field>
            <Field label="Fee Status"><Select value={f.fee} onValueChange={v => set("fee", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Paid">Paid</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Overdue">Overdue</SelectItem></SelectContent></Select></Field>
          </FieldRow>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Save Student</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddStaffDialog({ open, onOpenChange, onSave, nextSeq }:
  { open: boolean; onOpenChange: (v: boolean) => void; onSave: (s: StaffM) => void; nextSeq: number }) {
  const [f, setF] = useState<any>({ designation: DESIGNATIONS[0], department: STAFF_DEPTS[0] });
  const set = (k: string, v: any) => setF({ ...f, [k]: v });
  const save = () => {
    if (!f.name || !f.mobile) { toast.error("Name and mobile required"); return; }
    onSave({
      id: `E${String(nextSeq).padStart(3, "0")}`,
      name: f.name, designation: f.designation, department: f.department,
      mobile: f.mobile, email: f.email ?? "—",
      salary: Number(f.salary) || 20000, joiningDate: f.joiningDate || new Date().toISOString().slice(0, 10),
      status: "Active",
    });
    setF({ designation: DESIGNATIONS[0], department: STAFF_DEPTS[0] });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Add Staff</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <FieldRow>
            <Field label="Staff Name *"><Input value={f.name ?? ""} onChange={e => set("name", e.target.value)} /></Field>
            <Field label="Designation"><Select value={f.designation} onValueChange={v => set("designation", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DESIGNATIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Department"><Select value={f.department} onValueChange={v => set("department", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STAFF_DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Mobile *"><Input value={f.mobile ?? ""} onChange={e => set("mobile", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Email"><Input type="email" value={f.email ?? ""} onChange={e => set("email", e.target.value)} /></Field>
            <Field label="Salary (₹)"><Input type="number" value={f.salary ?? ""} onChange={e => set("salary", e.target.value)} /></Field>
          </FieldRow>
          <FieldRow>
            <Field label="Joining Date"><Input type="date" value={f.joiningDate ?? ""} onChange={e => set("joiningDate", e.target.value)} /></Field>
            <Field label=""><div /></Field>
          </FieldRow>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Save Staff</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
