import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  UserPlus, User, Phone, Briefcase, GraduationCap, FileUp, Banknote, ShieldCheck, Check, Plus, Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  PageHeader, Card, SectionHead, Grid, Field, Select, DocsGrid,
} from "./admin.admissions";

export const Route = createFileRoute("/admin/staff")({
  head: () => ({ meta: [{ title: "Staff Onboarding · Prabandh Q" }] }),
  component: StaffPage,
});

type Role = "teacher" | "staff";

const PERMISSIONS = [
  "Mark Attendance", "View Class Roster", "Issue Fee Receipts", "Edit Marks / Grades",
  "Manage Timetable", "Library Access", "AI Lesson Planner", "Send Announcements",
];

function StaffPage() {
  const [role, setRole] = useState<Role>("teacher");
  const [quals, setQuals] = useState([{ degree: "", board: "", year: "", grade: "" }]);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [perms, setPerms] = useState<Record<string, boolean>>({
    "Mark Attendance": true, "View Class Roster": true, "Send Announcements": true,
  });

  const submit = () => toast.success(`${role === "teacher" ? "Teacher" : "Staff"} onboarded successfully.`);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserPlus}
        title={role === "teacher" ? "Add New Teacher" : "Add New Staff Member"}
        subtitle="Capture personal, employment, qualification, salary and access details for HR records."
      />

      {/* Role switcher */}
      <div className="inline-flex rounded-xl border border-border/60 bg-card p-1 shadow-soft">
        {(["teacher", "staff"] as Role[]).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition-all",
              role === r ? "bg-gradient-hero text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r === "teacher" ? "Teacher" : "General Staff"}
          </button>
        ))}
      </div>

      <Card>
        <SectionHead n={1} icon={User} title="Personal details" />
        <Grid>
          <Field label="Employee ID"><Input defaultValue={"EMP-" + Math.floor(10000 + Math.random()*90000)} readOnly className="bg-secondary/40" /></Field>
          <Field label="Full Name"><Input placeholder="Priya Mehta" /></Field>
          <Field label="Date of Birth"><Input type="date" /></Field>
          <Field label="Gender"><Select><option>Female</option><option>Male</option><option>Other</option></Select></Field>
          <Field label="Marital Status"><Select><option>Single</option><option>Married</option></Select></Field>
          <Field label="Blood Group">
            <Select><option value="">Select</option>{["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}</Select>
          </Field>
          <Field label="Aadhaar Number"><Input placeholder="XXXX-XXXX-XXXX" /></Field>
          <Field label="PAN"><Input placeholder="ABCDE1234F" /></Field>
          <Field label="Nationality"><Input defaultValue="Indian" /></Field>
        </Grid>
      </Card>

      <Card>
        <SectionHead n={2} icon={Phone} title="Contact details" />
        <Grid>
          <Field label="Mobile"><Input /></Field>
          <Field label="Alternate Mobile"><Input /></Field>
          <Field label="Personal Email"><Input type="email" /></Field>
          <Field label="Work Email"><Input type="email" /></Field>
          <Field label="Current Address" full>
            <textarea rows={2} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </Field>
          <Field label="Permanent Address" full>
            <textarea rows={2} className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
          </Field>
        </Grid>
      </Card>

      <Card>
        <SectionHead n={3} icon={Briefcase} title="Employment information" />
        <Grid>
          <Field label="Designation">
            <Select>
              {(role === "teacher"
                ? ["PGT","TGT","PRT","HOD","Vice Principal","Principal"]
                : ["Accountant","Librarian","Admin Officer","Receptionist","Security","Driver","Lab Assistant"]
              ).map((d) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Department">
            <Select>
              {(role === "teacher"
                ? ["Mathematics","Science","English","Hindi","Social Studies","Computer Science","Arts"]
                : ["Administration","Accounts","Library","Operations","Transport"]
              ).map((d) => <option key={d}>{d}</option>)}
            </Select>
          </Field>
          <Field label="Employment Type">
            <Select><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Visiting</option></Select>
          </Field>
          <Field label="Joining Date"><Input type="date" /></Field>
          <Field label="Reporting To"><Input placeholder="Principal / HOD name" /></Field>
          <Field label="Experience (years)"><Input type="number" placeholder="6" /></Field>
          {role === "teacher" && (
            <>
              <Field label="Subjects Taught" full><Input placeholder="Maths, Physics" /></Field>
              <Field label="Classes Assigned" full><Input placeholder="9-A, 10-B, 11-Sci" /></Field>
            </>
          )}
        </Grid>
      </Card>

      <Card>
        <SectionHead n={4} icon={GraduationCap} title="Qualifications" />
        <div className="space-y-3">
          {quals.map((q, i) => (
            <div key={i} className="grid gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3 sm:grid-cols-[1fr_1fr_120px_120px_auto]">
              <Input placeholder="Degree (B.Ed, M.Sc…)" value={q.degree} onChange={(e) => update(i, "degree", e.target.value)} />
              <Input placeholder="University / Board" value={q.board} onChange={(e) => update(i, "board", e.target.value)} />
              <Input placeholder="Year" value={q.year} onChange={(e) => update(i, "year", e.target.value)} />
              <Input placeholder="Grade" value={q.grade} onChange={(e) => update(i, "grade", e.target.value)} />
              <Button variant="ghost" size="icon" onClick={() => setQuals(quals.filter((_, x) => x !== i))} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setQuals([...quals, { degree:"", board:"", year:"", grade:"" }])}>
            <Plus className="h-4 w-4" /> Add Qualification
          </Button>
        </div>
      </Card>

      <Card>
        <SectionHead n={5} icon={FileUp} title="Documents upload" />
        <DocsGrid
          items={["Resume / CV", "Aadhaar", "PAN Card", "Degree Certificates", "Experience Letter", "Cancelled Cheque", "Passport Photo", "Police Verification"]}
          files={files}
          onChange={setFiles}
        />
      </Card>

      <Card>
        <SectionHead n={6} icon={Banknote} title="Salary & banking details" />
        <Grid>
          <Field label="Bank Name"><Input placeholder="HDFC Bank" /></Field>
          <Field label="Branch"><Input placeholder="Koramangala" /></Field>
          <Field label="IFSC Code"><Input placeholder="HDFC0001234" /></Field>
          <Field label="Account Number"><Input /></Field>
          <Field label="Account Holder"><Input /></Field>
          <Field label="UPI ID"><Input placeholder="name@upi" /></Field>
          <Field label="Basic Salary (₹)"><Input type="number" placeholder="45000" /></Field>
          <Field label="HRA (₹)"><Input type="number" placeholder="18000" /></Field>
          <Field label="Other Allowances (₹)"><Input type="number" placeholder="7000" /></Field>
          <Field label="PF Account No."><Input /></Field>
          <Field label="ESI Number"><Input /></Field>
          <Field label="TDS Applicable"><Select><option>Yes</option><option>No</option></Select></Field>
        </Grid>
      </Card>

      <Card>
        <SectionHead n={7} icon={ShieldCheck} title="Login access & permissions" />
        <Grid>
          <Field label="Login Email"><Input type="email" placeholder="priya@stxaviers.edu.in" /></Field>
          <Field label="Temporary Password"><Input defaultValue="Pq@Welcome!" /></Field>
          <Field label="Role">
            <Select defaultValue={role}>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
        </Grid>
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Module Permissions</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {PERMISSIONS.map((p) => (
              <label key={p} className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                perms[p] ? "border-primary bg-primary/5 text-foreground" : "border-border/60 bg-secondary/30 text-muted-foreground"
              )}>
                <input
                  type="checkbox"
                  checked={!!perms[p]}
                  onChange={(e) => setPerms({ ...perms, [p]: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
                <span className="truncate">{p}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button variant="outline">Save Draft</Button>
        <Button onClick={submit} className="bg-gradient-hero">
          <Check className="h-4 w-4" /> {role === "teacher" ? "Add Teacher" : "Add Staff"}
        </Button>
      </div>
    </div>
  );

  function update(i: number, k: keyof typeof quals[number], v: string) {
    setQuals(quals.map((q, x) => (x === i ? { ...q, [k]: v } : q)));
  }
}
