import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Mail } from "lucide-react";
import { toast } from "sonner";
import { useTenant, getPeople, setPeopleStore, type Person } from "@/components/tenant";

export const Route = createFileRoute("/admin/people")({
  component: People,
});

function People() {
  const tenant = useTenant();
  const isCollege = tenant.type === "college";
  const [people, setPeople] = useState<Person[]>(getPeople());
  const [tab, setTab] = useState<"student" | "staff">("student");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  // form state
  const [f, setF] = useState({ name: "", email: "", role: "student", klass: "", section: "", course: "", department: "", semester: "" });

  const filtered = useMemo(
    () => people.filter((p) => p.role === tab && p.name.toLowerCase().includes(q.toLowerCase())),
    [people, tab, q]
  );

  const submit = () => {
    if (!f.name || !f.email) { toast.error("Name and email are required."); return; }
    const next: Person = {
      id: Math.random().toString(36).slice(2, 10),
      name: f.name,
      email: f.email,
      role: f.role as "student" | "staff",
      ...(isCollege
        ? { course: f.course, department: f.department, semester: f.semester }
        : { klass: f.klass, section: f.section }),
    };
    const arr = [next, ...people];
    setPeople(arr); setPeopleStore(arr);
    setOpen(false);
    setF({ name: "", email: "", role: "student", klass: "", section: "", course: "", department: "", semester: "" });
    toast.success(`${next.role === "student" ? "Student" : "Staff"} added successfully.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Students & Staff</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your {isCollege ? "college" : "school"} community.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-95">
              <Plus className="mr-1.5 h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add new {f.role}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select value={f.role} onValueChange={(v) => setF({ ...f, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">{isCollege ? "Professor" : "Teacher"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
              </div>

              {isCollege ? (
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Course / Degree</Label>
                    <Input value={f.course} onChange={(e) => setF({ ...f, course: e.target.value })} placeholder="B.Sc CS" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Input value={f.department} onChange={(e) => setF({ ...f, department: e.target.value })} placeholder="Computer Sci." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Semester</Label>
                    <Input value={f.semester} onChange={(e) => setF({ ...f, semester: e.target.value })} placeholder="3" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Class</Label>
                    <Input value={f.klass} onChange={(e) => setF({ ...f, klass: e.target.value })} placeholder="10" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Section</Label>
                    <Input value={f.section} onChange={(e) => setF({ ...f, section: e.target.value })} placeholder="A" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} className="bg-gradient-hero text-primary-foreground">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-gradient-card p-4 shadow-soft sm:p-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "student" | "staff")}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="staff">{isCollege ? "Professors" : "Teachers"}</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name…" className="pl-9" />
            </div>
          </div>

          <TabsContent value={tab} className="mt-4">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-background">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    {isCollege ? (
                      <>
                        <TableHead>Course</TableHead>
                        <TableHead className="hidden sm:table-cell">Department</TableHead>
                        <TableHead>Sem</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Class</TableHead>
                        <TableHead>Section</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        No {tab === "student" ? "students" : "staff"} found.
                      </TableCell>
                    </TableRow>
                  ) : filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-hero text-xs font-bold text-primary-foreground">
                            {p.name.split(" ").map(s => s[0]).slice(0,2).join("")}
                          </span>
                          <span className="font-medium">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Mail className="h-3.5 w-3.5" />{p.email}
                        </span>
                      </TableCell>
                      {isCollege ? (
                        <>
                          <TableCell><Badge variant="secondary">{p.course || "—"}</Badge></TableCell>
                          <TableCell className="hidden sm:table-cell">{p.department || "—"}</TableCell>
                          <TableCell>{p.semester || "—"}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell><Badge variant="secondary">Class {p.klass || "—"}</Badge></TableCell>
                          <TableCell>{p.section || "—"}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
