import type { ModuleSchema } from "./module-data";

// ──────────────────────────────────────────────────────────────────────────
// Shared teacher demo dataset — 25 realistic students.
// Used across attendance, homework, assignments, report cards, performance.
// ──────────────────────────────────────────────────────────────────────────

const FIRST = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Krishna","Ishaan","Kabir","Rudra","Ayaan","Dhruv","Yash","Atharv","Ananya","Diya","Saanvi","Aadhya","Myra","Aanya","Pari","Anika","Navya","Kiara"];
const LAST = ["Sharma","Verma","Patel","Iyer","Reddy","Singh","Kumar","Gupta","Khan","Das","Rao","Nair","Mehta","Joshi","Bose","Pillai","Chopra","Bhatt","Saxena","Kapoor"];
const CLASSES = ["X-A","X-B","XI-Sci","XII-Sci","XII-Com"];
const SUBJECTS = ["Mathematics","Physics","Chemistry","Biology","English","Computer Science"];

function rand(seed: number) { // deterministic PRNG (avoid SSR hydration mismatch)
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
const rnd = rand(424242);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const between = (a: number, b: number) => Math.floor(rnd() * (b - a + 1)) + a;

export type Student = {
  id: string; rollNo: string; name: string; klass: string;
  photo: string; grade: string; percent: number; attendance: number;
  guardian: string; phone: string;
};

export const TEACHER_STUDENTS: Student[] = Array.from({ length: 25 }, (_, i) => {
  const first = FIRST[i % FIRST.length];
  const last = LAST[(i * 3 + 1) % LAST.length];
  const name = `${first} ${last}`;
  const klass = CLASSES[i % CLASSES.length];
  const percent = between(58, 96);
  const grade = percent >= 90 ? "A+" : percent >= 80 ? "A" : percent >= 70 ? "B+" : percent >= 60 ? "B" : "C";
  return {
    id: `stu-${i + 1}`,
    rollNo: `R${(101 + i).toString()}`,
    name,
    klass,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    grade,
    percent,
    attendance: between(72, 99),
    guardian: `${pick(LAST)} ${last}`,
    phone: `98${between(10000000, 99999999)}`,
  };
});

// Static date helpers
const dateOffset = (offset = 0) => {
  const d = new Date(2026, 5, 23); d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

// ──────────────────────────────────────────────────────────────────────────
// 30 Teacher module schemas
// ──────────────────────────────────────────────────────────────────────────

const TMS: Record<string, ModuleSchema> = {
  /* 3. Class Management */
  "classes": {
    noun: "Student",
    fields: [
      { key: "name", label: "Student Name", type: "text", required: true },
      { key: "rollNo", label: "Roll No.", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "grade", label: "Grade", type: "select", options: ["A+","A","B+","B","C"] },
      { key: "percent", label: "Percent", type: "number" },
      { key: "guardian", label: "Guardian", type: "text" },
      { key: "phone", label: "Phone", type: "tel" },
    ],
    columns: ["rollNo","name","klass","grade","percent","guardian"],
    searchKey: "name", filterKey: "klass",
    stats: [
      { label: "Total Students", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Top Performers (A+)", compute: (r)=>r.filter(x=>x.grade==="A+").length.toString(), tone:"emerald" },
      { label: "At Risk (< 60%)", compute: (r)=>r.filter(x=>(+x.percent||0)<60).length.toString(), tone:"rose" },
      { label: "Avg %", compute: (r)=>(r.reduce((a,b)=>a+(+b.percent||0),0)/Math.max(r.length,1)).toFixed(1) },
    ],
    seed: TEACHER_STUDENTS.map(s => ({ name:s.name, rollNo:s.rollNo, klass:s.klass, grade:s.grade, percent:s.percent, guardian:s.guardian, phone:s.phone })),
  },

  /* 4. Attendance */
  "attendance": {
    noun: "Attendance Entry",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "rollNo", label: "Roll", type: "text" },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "status", label: "Status", type: "select", options: ["Present","Absent","Late"], required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
    ],
    columns: ["date","rollNo","name","klass","subject","status"],
    searchKey: "name", filterKey: "status",
    stats: [
      { label: "Total Marked", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Present", compute: (r)=>r.filter(x=>x.status==="Present").length.toString(), tone:"emerald" },
      { label: "Absent", compute: (r)=>r.filter(x=>x.status==="Absent").length.toString(), tone:"rose" },
      { label: "Late", compute: (r)=>r.filter(x=>x.status==="Late").length.toString(), tone:"amber" },
    ],
    seed: TEACHER_STUDENTS.flatMap((s, i) => [0,1,2].map(d => ({
      name: s.name, rollNo: s.rollNo, klass: s.klass, date: dateOffset(d),
      status: s.attendance > 90 ? "Present" : s.attendance > 80 ? (d===1?"Late":"Present") : (d===0?"Absent":"Present"),
      subject: SUBJECTS[(i+d) % SUBJECTS.length],
    }))),
  },

  /* 5. Subjects */
  "subjects": {
    noun: "Subject",
    fields: [
      { key: "name", label: "Subject", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "chapters", label: "Total Chapters", type: "number" },
      { key: "completed", label: "Completed", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["On Track","Delayed","Completed"] },
    ],
    columns: ["name","klass","chapters","completed","status"],
    searchKey: "name", filterKey: "klass",
    stats: [
      { label: "Subjects", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "On Track", compute:(r)=>r.filter(x=>x.status==="On Track").length.toString(), tone:"emerald" },
      { label: "Delayed", compute:(r)=>r.filter(x=>x.status==="Delayed").length.toString(), tone:"rose" },
      { label: "Avg Completion %", compute:(r)=>{
        const t=r.reduce((a,b)=>a+(+b.chapters||0),0); const c=r.reduce((a,b)=>a+(+b.completed||0),0);
        return t? Math.round(c*100/t)+"%" : "0%";
      }, tone:"amber" },
    ],
    seed: SUBJECTS.flatMap((sub, i) => CLASSES.slice(0,3).map((k,j) => ({
      name: sub, klass: k, chapters: 12 + i, completed: 6 + j*2,
      status: j===1?"Delayed":"On Track",
    }))),
  },

  /* 6. Lesson Plans */
  "lesson-plans": {
    noun: "Lesson Plan",
    fields: [
      { key: "title", label: "Topic", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "date", label: "Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Draft","Scheduled","Delivered"] },
      { key: "outcome", label: "Learning Outcome", type: "text" },
    ],
    columns: ["date","title","subject","klass","status"],
    searchKey: "title", filterKey: "status",
    stats: [
      { label: "Plans", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Delivered", compute:(r)=>r.filter(x=>x.status==="Delivered").length.toString(), tone:"emerald" },
      { label: "Scheduled", compute:(r)=>r.filter(x=>x.status==="Scheduled").length.toString(), tone:"amber" },
      { label: "Drafts", compute:(r)=>r.filter(x=>x.status==="Draft").length.toString() },
    ],
    seed: ["Quadratic Equations","Newton's Laws","Periodic Table","Cell Division","Shakespeare Sonnets","Loops & Arrays","Trigonometry","Thermodynamics"].map((t,i)=>({
      title:t, subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      date:dateOffset(i-3), status:i<3?"Delivered":i<6?"Scheduled":"Draft",
      outcome:"Students will be able to apply concepts to solve problems.",
    })),
  },

  /* 7. Homework */
  "homework": {
    noun: "Homework",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "assignedOn", label: "Assigned", type: "date" },
      { key: "dueOn", label: "Due", type: "date" },
      { key: "submitted", label: "Submitted", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active","Graded","Overdue"] },
    ],
    columns: ["title","subject","klass","dueOn","submitted","status"],
    searchKey: "title", filterKey: "status",
    stats: [
      { label: "Total Homework", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Active", compute:(r)=>r.filter(x=>x.status==="Active").length.toString(), tone:"amber" },
      { label: "Graded", compute:(r)=>r.filter(x=>x.status==="Graded").length.toString(), tone:"emerald" },
      { label: "Avg Submission", compute:(r)=>(r.reduce((a,b)=>a+(+b.submitted||0),0)/Math.max(r.length,1)).toFixed(0) },
    ],
    seed: ["Algebra Worksheet","Lab Report - Friction","Mole Concept Problems","Photosynthesis Diagram","Essay - The Tempest","Python Loops Exercise","Triangles Practice","Calorimetry Set"].map((t,i)=>({
      title:t, subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      assignedOn:dateOffset(i+2), dueOn:dateOffset(i-1),
      submitted: 18 + (i%6), status: i<2?"Graded":i===7?"Overdue":"Active",
    })),
  },

  /* 8. Assignments */
  "assignments": {
    noun: "Assignment",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "type", label: "Type", type: "select", options: ["Project","Worksheet","Lab","Presentation"] },
      { key: "dueOn", label: "Due", type: "date" },
      { key: "marks", label: "Max Marks", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active","Evaluating","Completed"] },
    ],
    columns: ["title","subject","klass","type","dueOn","marks","status"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Assignments", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Active", compute:(r)=>r.filter(x=>x.status==="Active").length.toString(), tone:"amber" },
      { label: "Completed", compute:(r)=>r.filter(x=>x.status==="Completed").length.toString(), tone:"emerald" },
      { label: "Avg Marks", compute:(r)=>(r.reduce((a,b)=>a+(+b.marks||0),0)/Math.max(r.length,1)).toFixed(0) },
    ],
    seed: ["Solar Energy Model","Chemistry Lab Practical","Data Structures Project","Macbeth Presentation","Ecology Field Notes","Physics Pendulum Lab"].map((t,i)=>({
      title:t, subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      type:["Project","Lab","Project","Presentation","Worksheet","Lab"][i], dueOn:dateOffset(i-2),
      marks:[50,40,60,30,25,40][i], status:i<2?"Completed":i<4?"Evaluating":"Active",
    })),
  },

  /* 9. Study Materials */
  "materials": {
    noun: "Material",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Notes","PDF","Video","Presentation"], required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "size", label: "Size (MB)", type: "number" },
      { key: "uploaded", label: "Uploaded", type: "date" },
    ],
    columns: ["title","type","subject","klass","size","uploaded"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Resources", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Videos", compute:(r)=>r.filter(x=>x.type==="Video").length.toString(), tone:"emerald" },
      { label: "PDFs", compute:(r)=>r.filter(x=>x.type==="PDF").length.toString(), tone:"amber" },
      { label: "Total Size MB", compute:(r)=>r.reduce((a,b)=>a+(+b.size||0),0).toFixed(0) },
    ],
    seed: ["Algebra Notes","Newton Laws PDF","Periodic Table Video","Cell Bio Slides","Sonnets PDF","Python Tutorial Video","Calculus Notes","Lab Manual"].map((t,i)=>({
      title:t, type:["Notes","PDF","Video","Presentation","PDF","Video","Notes","PDF"][i],
      subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      size:[2,4,120,18,3,240,5,9][i], uploaded:dateOffset(i+1),
    })),
  },

  /* 10. Online Classes */
  "online-classes": {
    noun: "Online Class",
    fields: [
      { key: "title", label: "Topic", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "platform", label: "Platform", type: "select", options: ["Zoom","Google Meet","MS Teams"] },
      { key: "date", label: "Date", type: "date" },
      { key: "duration", label: "Duration (min)", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Scheduled","Live","Completed"] },
    ],
    columns: ["date","title","subject","klass","platform","status"],
    searchKey: "title", filterKey: "platform",
    stats: [
      { label: "Sessions", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Completed", compute:(r)=>r.filter(x=>x.status==="Completed").length.toString(), tone:"emerald" },
      { label: "Scheduled", compute:(r)=>r.filter(x=>x.status==="Scheduled").length.toString(), tone:"amber" },
      { label: "Total Hours", compute:(r)=>(r.reduce((a,b)=>a+(+b.duration||0),0)/60).toFixed(1) },
    ],
    seed: ["Doubt Session - Algebra","Live Demo - Pendulum","Org Chem Recap","Bio Quiz","Grammar Drill","Coding Workshop"].map((t,i)=>({
      title:t, subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      platform:["Zoom","Google Meet","MS Teams","Zoom","Google Meet","Zoom"][i],
      date:dateOffset(i-2), duration:[45,60,40,30,45,90][i], status:i<2?"Completed":i===2?"Live":"Scheduled",
    })),
  },

  /* 11. Examinations */
  "exams": {
    noun: "Exam",
    fields: [
      { key: "title", label: "Exam Title", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "date", label: "Date", type: "date" },
      { key: "maxMarks", label: "Max Marks", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Scheduled","Marks Entry","Published"] },
    ],
    columns: ["title","subject","klass","date","maxMarks","status"],
    searchKey: "title", filterKey: "status",
    stats: [
      { label: "Exams", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Published", compute:(r)=>r.filter(x=>x.status==="Published").length.toString(), tone:"emerald" },
      { label: "Marks Entry", compute:(r)=>r.filter(x=>x.status==="Marks Entry").length.toString(), tone:"amber" },
      { label: "Scheduled", compute:(r)=>r.filter(x=>x.status==="Scheduled").length.toString() },
    ],
    seed: ["Mid-Term","Unit Test 1","Pre-Board","Final Exam","Surprise Test","Practical"].map((t,i)=>({
      title:t, subject:SUBJECTS[i%SUBJECTS.length], klass:CLASSES[i%CLASSES.length],
      date:dateOffset(i-4), maxMarks:[100,25,80,100,20,30][i],
      status:i<2?"Published":i<4?"Marks Entry":"Scheduled",
    })),
  },

  /* 12. Assessment & Evaluation */
  "assessment": {
    noun: "Assessment",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "type", label: "Type", type: "select", options: ["Internal","Practical","Continuous","Project"] },
      { key: "marks", label: "Marks", type: "number" },
      { key: "max", label: "Out of", type: "number" },
      { key: "remark", label: "Remark", type: "text" },
    ],
    columns: ["name","subject","type","marks","max","remark"],
    searchKey: "name", filterKey: "type",
    stats: [
      { label: "Evaluations", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Avg %", compute:(r)=>{const t=r.reduce((a,b)=>a+(+b.max||0),0); const m=r.reduce((a,b)=>a+(+b.marks||0),0); return t?Math.round(m*100/t)+"%":"0%";}, tone:"emerald" },
      { label: "Top Score", compute:(r)=>Math.max(0,...r.map(x=>Math.round((+x.marks||0)/(+x.max||1)*100))).toString()+"%" },
      { label: "Below 60%", compute:(r)=>r.filter(x=>(+x.marks/Math.max(+x.max,1))<0.6).length.toString(), tone:"rose" },
    ],
    seed: TEACHER_STUDENTS.slice(0,18).map((s,i)=>({
      name:s.name, subject:SUBJECTS[i%SUBJECTS.length],
      type:["Internal","Practical","Continuous","Project"][i%4],
      marks: Math.round(s.percent*0.4), max:40,
      remark: s.percent>85?"Excellent":s.percent>70?"Good":"Needs improvement",
    })),
  },

  /* 13. Report Cards */
  "report-cards": {
    noun: "Report Card",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "rollNo", label: "Roll", type: "text" },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "percent", label: "Overall %", type: "number" },
      { key: "grade", label: "Grade", type: "select", options: ["A+","A","B+","B","C"] },
      { key: "remark", label: "Remark", type: "text" },
    ],
    columns: ["rollNo","name","klass","percent","grade","remark"],
    searchKey: "name", filterKey: "grade",
    stats: [
      { label: "Cards", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "A+ / A", compute:(r)=>r.filter(x=>["A+","A"].includes(x.grade)).length.toString(), tone:"emerald" },
      { label: "Avg %", compute:(r)=>(r.reduce((a,b)=>a+(+b.percent||0),0)/Math.max(r.length,1)).toFixed(1) },
      { label: "Below B", compute:(r)=>r.filter(x=>x.grade==="C").length.toString(), tone:"rose" },
    ],
    seed: TEACHER_STUDENTS.map(s=>({
      name:s.name, rollNo:s.rollNo, klass:s.klass, percent:s.percent, grade:s.grade,
      remark: s.percent>90?"Outstanding all-rounder":s.percent>75?"Consistent performer":s.percent>60?"Steady; needs focus":"Requires targeted support",
    })),
  },

  /* 14. Performance Analytics */
  "performance": {
    noun: "Performance Record",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "percent", label: "Score %", type: "number" },
      { key: "trend", label: "Trend", type: "select", options: ["Improving","Stable","Declining"] },
    ],
    columns: ["name","klass","subject","percent","trend"],
    searchKey: "name", filterKey: "trend",
    stats: [
      { label: "Students Tracked", compute:(r)=>new Set(r.map(x=>x.name)).size.toString(), tone:"primary" },
      { label: "Improving", compute:(r)=>r.filter(x=>x.trend==="Improving").length.toString(), tone:"emerald" },
      { label: "Declining", compute:(r)=>r.filter(x=>x.trend==="Declining").length.toString(), tone:"rose" },
      { label: "Top Score %", compute:(r)=>Math.max(0,...r.map(x=>+x.percent||0)).toString() },
    ],
    seed: TEACHER_STUDENTS.slice(0,20).map((s,i)=>({
      name:s.name, klass:s.klass, subject:SUBJECTS[i%SUBJECTS.length], percent:s.percent,
      trend: s.percent>85?"Improving":s.percent>65?"Stable":"Declining",
    })),
  },

  /* 15. Communication */
  "communication": {
    noun: "Message",
    fields: [
      { key: "to", label: "Recipient", type: "text", required: true },
      { key: "audience", label: "Audience", type: "select", options: ["Student","Parent","Admin","Class Group"] },
      { key: "subject", label: "Subject", type: "text", required: true },
      { key: "channel", label: "Channel", type: "select", options: ["Email","SMS","WhatsApp","In-App"] },
      { key: "date", label: "Sent", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Draft","Sent","Read","Replied"] },
    ],
    columns: ["date","to","audience","subject","channel","status"],
    searchKey: "subject", filterKey: "channel",
    stats: [
      { label: "Messages", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Sent", compute:(r)=>r.filter(x=>x.status!=="Draft").length.toString(), tone:"emerald" },
      { label: "Drafts", compute:(r)=>r.filter(x=>x.status==="Draft").length.toString(), tone:"amber" },
      { label: "Replied", compute:(r)=>r.filter(x=>x.status==="Replied").length.toString() },
    ],
    seed: [
      { to:"Class X-A", audience:"Class Group", subject:"Homework reminder", channel:"WhatsApp", date:dateOffset(0), status:"Sent" },
      { to:"Aarav's Parent", audience:"Parent", subject:"Performance update", channel:"Email", date:dateOffset(1), status:"Read" },
      { to:"Vihaan Singh", audience:"Student", subject:"Project guidance", channel:"In-App", date:dateOffset(2), status:"Replied" },
      { to:"Admin Office", audience:"Admin", subject:"Leave request", channel:"Email", date:dateOffset(3), status:"Sent" },
      { to:"Class XII-Sci", audience:"Class Group", subject:"Pre-board schedule", channel:"SMS", date:dateOffset(4), status:"Sent" },
      { to:"Saanvi's Parent", audience:"Parent", subject:"PTM invite", channel:"WhatsApp", date:dateOffset(0), status:"Draft" },
    ],
  },

  /* 16. Parents */
  "parents": {
    noun: "Parent Interaction",
    fields: [
      { key: "name", label: "Parent Name", type: "text", required: true },
      { key: "student", label: "Student", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "purpose", label: "Purpose", type: "select", options: ["PTM","Progress Review","Discipline","Counselling"] },
      { key: "date", label: "Scheduled", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Scheduled","Completed","Cancelled"] },
    ],
    columns: ["date","name","student","klass","purpose","status"],
    searchKey: "name", filterKey: "purpose",
    stats: [
      { label: "Meetings", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Completed", compute:(r)=>r.filter(x=>x.status==="Completed").length.toString(), tone:"emerald" },
      { label: "Scheduled", compute:(r)=>r.filter(x=>x.status==="Scheduled").length.toString(), tone:"amber" },
      { label: "Cancelled", compute:(r)=>r.filter(x=>x.status==="Cancelled").length.toString(), tone:"rose" },
    ],
    seed: TEACHER_STUDENTS.slice(0,12).map((s,i)=>({
      name:s.guardian, student:s.name, klass:s.klass,
      purpose:["PTM","Progress Review","Discipline","Counselling"][i%4],
      date:dateOffset(i-5), status:i<6?"Completed":i===10?"Cancelled":"Scheduled",
    })),
  },

  /* 17. Calendar */
  "calendar": {
    noun: "Event",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Class","Exam","Meeting","Holiday","Event"] },
      { key: "date", label: "Date", type: "date" },
      { key: "time", label: "Time", type: "text" },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
    ],
    columns: ["date","time","title","type","klass"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Events", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Classes", compute:(r)=>r.filter(x=>x.type==="Class").length.toString(), tone:"emerald" },
      { label: "Exams", compute:(r)=>r.filter(x=>x.type==="Exam").length.toString(), tone:"amber" },
      { label: "Meetings", compute:(r)=>r.filter(x=>x.type==="Meeting").length.toString() },
    ],
    seed: ["Math Class","Physics Lab","Staff Meeting","Mid-Term Exam","Annual Sports","Republic Day","Chemistry Class","Parent Meeting"].map((t,i)=>({
      title:t, type:["Class","Class","Meeting","Exam","Event","Holiday","Class","Meeting"][i],
      date:dateOffset(i-3), time:["09:00","11:00","15:00","09:30","08:00","09:00","10:00","16:00"][i],
      klass:CLASSES[i%CLASSES.length],
    })),
  },

  /* 18. Behavior */
  "behavior": {
    noun: "Behavior Record",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "type", label: "Type", type: "select", options: ["Positive","Warning","Discipline","Incident"] },
      { key: "note", label: "Note", type: "text" },
      { key: "date", label: "Date", type: "date" },
      { key: "severity", label: "Severity", type: "select", options: ["Low","Medium","High"] },
    ],
    columns: ["date","name","klass","type","severity","note"],
    searchKey: "name", filterKey: "type",
    stats: [
      { label: "Records", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Positive", compute:(r)=>r.filter(x=>x.type==="Positive").length.toString(), tone:"emerald" },
      { label: "Warnings", compute:(r)=>r.filter(x=>x.type==="Warning").length.toString(), tone:"amber" },
      { label: "High Severity", compute:(r)=>r.filter(x=>x.severity==="High").length.toString(), tone:"rose" },
    ],
    seed: TEACHER_STUDENTS.slice(0,10).map((s,i)=>({
      name:s.name, klass:s.klass,
      type:["Positive","Positive","Warning","Discipline","Positive","Incident","Positive","Warning","Positive","Positive"][i],
      note:["Helped peers","Excellent participation","Late submission","Disruptive","Volunteered","Minor scuffle","Outstanding answer","Missed homework","Led activity","Polite & punctual"][i],
      date:dateOffset(i), severity:i===5?"High":i===3?"Medium":"Low",
    })),
  },

  /* 19. Doubts */
  "doubts": {
    noun: "Doubt",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "question", label: "Question", type: "text", required: true },
      { key: "status", label: "Status", type: "select", options: ["Open","In Progress","Answered"] },
      { key: "date", label: "Asked", type: "date" },
    ],
    columns: ["date","name","subject","question","status"],
    searchKey: "question", filterKey: "status",
    stats: [
      { label: "Total Doubts", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Answered", compute:(r)=>r.filter(x=>x.status==="Answered").length.toString(), tone:"emerald" },
      { label: "Open", compute:(r)=>r.filter(x=>x.status==="Open").length.toString(), tone:"rose" },
      { label: "In Progress", compute:(r)=>r.filter(x=>x.status==="In Progress").length.toString(), tone:"amber" },
    ],
    seed: TEACHER_STUDENTS.slice(0,10).map((s,i)=>({
      name:s.name, subject:SUBJECTS[i%SUBJECTS.length],
      question:["What is integration by parts?","Explain Lenz's law","Difference between sigma & pi bond","What is meiosis stage 1?","Meaning of metaphor in sonnet 18","Time complexity of quicksort","Sine rule derivation","Hess's law example","DNA vs RNA","Recursion vs iteration"][i],
      status:i<4?"Answered":i<7?"In Progress":"Open", date:dateOffset(i),
    })),
  },

  /* 21. Resources */
  "resources": {
    noun: "Resource",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Question Bank","Worksheet","Notes","Presentation","Video"] },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "downloads", label: "Downloads", type: "number" },
      { key: "rating", label: "Rating", type: "number" },
    ],
    columns: ["title","type","subject","downloads","rating"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Resources", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Total Downloads", compute:(r)=>r.reduce((a,b)=>a+(+b.downloads||0),0).toString(), tone:"emerald" },
      { label: "Avg Rating", compute:(r)=>(r.reduce((a,b)=>a+(+b.rating||0),0)/Math.max(r.length,1)).toFixed(1), tone:"amber" },
      { label: "Top Type", compute:(r)=>{const m:Record<string,number>={}; r.forEach(x=>m[x.type]=(m[x.type]||0)+1); return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]?.[0]||"-";} },
    ],
    seed: ["JEE Question Bank","CBSE Worksheet Set","Organic Chem Notes","Cell Biology Slides","Algebra Video Series","Grammar Worksheet","Calculus Question Bank","Coding Notes"].map((t,i)=>({
      title:t, type:["Question Bank","Worksheet","Notes","Presentation","Video","Worksheet","Question Bank","Notes"][i],
      subject:SUBJECTS[i%SUBJECTS.length], downloads:[120,80,200,65,340,90,150,210][i], rating:[4.8,4.5,4.9,4.3,4.7,4.4,4.6,4.8][i],
    })),
  },

  /* 22. Certificates */
  "certificates": {
    noun: "Certificate",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Award","Certification","Training","Achievement"] },
      { key: "date", label: "Issued On", type: "date" },
    ],
    columns: ["title","issuer","type","date"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Total", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Awards", compute:(r)=>r.filter(x=>x.type==="Award").length.toString(), tone:"emerald" },
      { label: "Certifications", compute:(r)=>r.filter(x=>x.type==="Certification").length.toString(), tone:"amber" },
      { label: "Trainings", compute:(r)=>r.filter(x=>x.type==="Training").length.toString() },
    ],
    seed: [
      { title:"Best Teacher Award 2024", issuer:"Prabandh Q HQ", type:"Award", date:dateOffset(180) },
      { title:"NPTEL - Pedagogy Cert.", issuer:"IIT Madras", type:"Certification", date:dateOffset(120) },
      { title:"Google Certified Educator L1", issuer:"Google", type:"Certification", date:dateOffset(90) },
      { title:"CBSE Capacity Building Program", issuer:"CBSE", type:"Training", date:dateOffset(60) },
      { title:"100% Result Achievement", issuer:"School", type:"Achievement", date:dateOffset(30) },
    ],
  },

  /* 23. Leave */
  "leave": {
    noun: "Leave",
    fields: [
      { key: "type", label: "Type", type: "select", options: ["Casual","Sick","Earned","Maternity","LOP"], required: true },
      { key: "from", label: "From", type: "date", required: true },
      { key: "to", label: "To", type: "date", required: true },
      { key: "days", label: "Days", type: "number" },
      { key: "reason", label: "Reason", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Pending","Approved","Rejected"] },
    ],
    columns: ["from","to","type","days","reason","status"],
    searchKey: "reason", filterKey: "status",
    stats: [
      { label: "Applications", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Approved", compute:(r)=>r.filter(x=>x.status==="Approved").length.toString(), tone:"emerald" },
      { label: "Pending", compute:(r)=>r.filter(x=>x.status==="Pending").length.toString(), tone:"amber" },
      { label: "Days Taken", compute:(r)=>r.filter(x=>x.status==="Approved").reduce((a,b)=>a+(+b.days||0),0).toString() },
    ],
    seed: [
      { type:"Sick", from:dateOffset(40), to:dateOffset(38), days:3, reason:"Viral fever", status:"Approved" },
      { type:"Casual", from:dateOffset(20), to:dateOffset(20), days:1, reason:"Family function", status:"Approved" },
      { type:"Earned", from:dateOffset(10), to:dateOffset(8), days:3, reason:"Personal travel", status:"Approved" },
      { type:"Casual", from:dateOffset(2), to:dateOffset(2), days:1, reason:"Health check-up", status:"Pending" },
      { type:"Sick", from:dateOffset(60), to:dateOffset(59), days:2, reason:"Migraine", status:"Approved" },
      { type:"LOP", from:dateOffset(120), to:dateOffset(119), days:2, reason:"Emergency", status:"Rejected" },
    ],
  },

  /* 24. Payroll */
  "payroll": {
    noun: "Payslip",
    fields: [
      { key: "month", label: "Month", type: "text", required: true },
      { key: "gross", label: "Gross", type: "number" },
      { key: "deductions", label: "Deductions", type: "number" },
      { key: "net", label: "Net Pay", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Paid","Pending","Hold"] },
    ],
    columns: ["month","gross","deductions","net","status"],
    searchKey: "month", filterKey: "status",
    stats: [
      { label: "Months", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Paid", compute:(r)=>r.filter(x=>x.status==="Paid").length.toString(), tone:"emerald" },
      { label: "YTD Net", compute:(r)=>"₹"+r.filter(x=>x.status==="Paid").reduce((a,b)=>a+(+b.net||0),0).toLocaleString("en-IN") },
      { label: "Avg Net", compute:(r)=>"₹"+Math.round(r.reduce((a,b)=>a+(+b.net||0),0)/Math.max(r.length,1)).toLocaleString("en-IN") },
    ],
    seed: ["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026"].map((m,i)=>({
      month:m, gross:75000, deductions:8500, net:66500, status: i<5?"Paid":"Pending",
    })),
  },

  /* 25. Professional Development */
  "development": {
    noun: "Training",
    fields: [
      { key: "title", label: "Program", type: "text", required: true },
      { key: "provider", label: "Provider", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["Workshop","Certification","Conference","Course"] },
      { key: "date", label: "Date", type: "date" },
      { key: "hours", label: "Hours", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Planned","In Progress","Completed"] },
    ],
    columns: ["date","title","provider","type","hours","status"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Programs", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Completed", compute:(r)=>r.filter(x=>x.status==="Completed").length.toString(), tone:"emerald" },
      { label: "Hours Logged", compute:(r)=>r.filter(x=>x.status==="Completed").reduce((a,b)=>a+(+b.hours||0),0).toString() },
      { label: "Planned", compute:(r)=>r.filter(x=>x.status==="Planned").length.toString(), tone:"amber" },
    ],
    seed: [
      { title:"AI in Classroom", provider:"Lovable Academy", type:"Workshop", date:dateOffset(45), hours:8, status:"Completed" },
      { title:"NEP 2020 Bootcamp", provider:"NCERT", type:"Course", date:dateOffset(30), hours:20, status:"Completed" },
      { title:"STEM Pedagogy", provider:"Khan Academy", type:"Course", date:dateOffset(10), hours:15, status:"In Progress" },
      { title:"International Edu Conf", provider:"ASCD", type:"Conference", date:dateOffset(-15), hours:24, status:"Planned" },
      { title:"Cambridge Assessor Prog.", provider:"Cambridge", type:"Certification", date:dateOffset(-30), hours:40, status:"Planned" },
    ],
  },

  /* 26. Documents */
  "documents": {
    noun: "Document",
    fields: [
      { key: "name", label: "File", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["Academic","Personal","HR","Lesson","Misc"] },
      { key: "size", label: "Size (KB)", type: "number" },
      { key: "uploaded", label: "Uploaded", type: "date" },
    ],
    columns: ["name","category","size","uploaded"],
    searchKey: "name", filterKey: "category",
    stats: [
      { label: "Files", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Academic", compute:(r)=>r.filter(x=>x.category==="Academic").length.toString(), tone:"emerald" },
      { label: "HR", compute:(r)=>r.filter(x=>x.category==="HR").length.toString(), tone:"amber" },
      { label: "Total KB", compute:(r)=>r.reduce((a,b)=>a+(+b.size||0),0).toString() },
    ],
    seed: [
      { name:"Appointment_Letter.pdf", category:"HR", size:420, uploaded:dateOffset(365) },
      { name:"PAN_Card.pdf", category:"Personal", size:120, uploaded:dateOffset(300) },
      { name:"Syllabus_XII_Phy.pdf", category:"Academic", size:760, uploaded:dateOffset(90) },
      { name:"Lesson_Newton.docx", category:"Lesson", size:80, uploaded:dateOffset(10) },
      { name:"Form16_FY25.pdf", category:"HR", size:540, uploaded:dateOffset(60) },
      { name:"Marksheet_Postgrad.pdf", category:"Personal", size:680, uploaded:dateOffset(800) },
    ],
  },

  /* 27. Reports */
  "reports": {
    noun: "Report",
    fields: [
      { key: "title", label: "Report Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Attendance","Homework","Assignment","Exam","Class","Student"] },
      { key: "period", label: "Period", type: "text" },
      { key: "generated", label: "Generated", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Ready","Generating","Scheduled"] },
    ],
    columns: ["generated","title","type","period","status"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Reports", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Ready", compute:(r)=>r.filter(x=>x.status==="Ready").length.toString(), tone:"emerald" },
      { label: "Generating", compute:(r)=>r.filter(x=>x.status==="Generating").length.toString(), tone:"amber" },
      { label: "Scheduled", compute:(r)=>r.filter(x=>x.status==="Scheduled").length.toString() },
    ],
    seed: ["Class X-A Attendance","Homework Submission Summary","Assignment Grades","Mid-Term Exam Analysis","Class XI-Sci Performance","Student At-Risk List"].map((t,i)=>({
      title:t, type:["Attendance","Homework","Assignment","Exam","Class","Student"][i],
      period:["Jun 2026","May 2026","May 2026","Q4 FY26","Term 1","Jun 2026"][i],
      generated:dateOffset(i*2), status:i<3?"Ready":i===5?"Scheduled":"Generating",
    })),
  },

  /* 28. Notifications */
  "notifications": {
    noun: "Notification",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["School","Academic","Student","Parent","Event"] },
      { key: "date", label: "Received", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Unread","Read","Archived"] },
    ],
    columns: ["date","title","type","status"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Total", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Unread", compute:(r)=>r.filter(x=>x.status==="Unread").length.toString(), tone:"rose" },
      { label: "Today", compute:(r)=>r.filter(x=>x.date===dateOffset(0)).length.toString(), tone:"emerald" },
      { label: "Events", compute:(r)=>r.filter(x=>x.type==="Event").length.toString(), tone:"amber" },
    ],
    seed: ["Staff meeting at 4 PM","XII-Sci result released","Student Aarav absent 3 days","Parent meeting tomorrow","Annual Day rehearsal","Salary credited","Curriculum update circular","Holiday on 25 Jun"].map((t,i)=>({
      title:t, type:["School","Academic","Student","Parent","Event","School","Academic","School"][i],
      date:dateOffset(i%4), status: i<3?"Unread":i<6?"Read":"Archived",
    })),
  },

  /* 29. Security */
  "security": {
    noun: "Session",
    fields: [
      { key: "device", label: "Device", type: "text", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "ip", label: "IP", type: "text" },
      { key: "lastActive", label: "Last Active", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Active","Idle","Revoked"] },
    ],
    columns: ["device","location","ip","lastActive","status"],
    searchKey: "device", filterKey: "status",
    stats: [
      { label: "Sessions", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Active", compute:(r)=>r.filter(x=>x.status==="Active").length.toString(), tone:"emerald" },
      { label: "Revoked", compute:(r)=>r.filter(x=>x.status==="Revoked").length.toString(), tone:"rose" },
      { label: "Unique Devices", compute:(r)=>new Set(r.map(x=>x.device)).size.toString() },
    ],
    seed: [
      { device:"Chrome - Windows 11", location:"Delhi, IN", ip:"103.21.x.x", lastActive:dateOffset(0), status:"Active" },
      { device:"Safari - iPhone 15", location:"Delhi, IN", ip:"49.207.x.x", lastActive:dateOffset(0), status:"Active" },
      { device:"Chrome - Android", location:"Noida, IN", ip:"49.207.x.x", lastActive:dateOffset(3), status:"Idle" },
      { device:"Edge - Windows 10", location:"Mumbai, IN", ip:"103.21.x.x", lastActive:dateOffset(40), status:"Revoked" },
    ],
  },

  /* 30. Settings */
  "settings": {
    noun: "Preference",
    fields: [
      { key: "name", label: "Setting", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["Profile","Notifications","Language","Theme","Accessibility"] },
      { key: "value", label: "Value", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Enabled","Disabled"] },
    ],
    columns: ["category","name","value","status"],
    searchKey: "name", filterKey: "category",
    stats: [
      { label: "Settings", compute:(r)=>r.length.toString(), tone:"primary" },
      { label: "Enabled", compute:(r)=>r.filter(x=>x.status==="Enabled").length.toString(), tone:"emerald" },
      { label: "Categories", compute:(r)=>new Set(r.map(x=>x.category)).size.toString() },
      { label: "Disabled", compute:(r)=>r.filter(x=>x.status==="Disabled").length.toString(), tone:"amber" },
    ],
    seed: [
      { name:"Display Name", category:"Profile", value:"Mrs. Priya Sharma", status:"Enabled" },
      { name:"Email Alerts", category:"Notifications", value:"Daily", status:"Enabled" },
      { name:"SMS Alerts", category:"Notifications", value:"Critical only", status:"Enabled" },
      { name:"WhatsApp Alerts", category:"Notifications", value:"Off", status:"Disabled" },
      { name:"Interface Language", category:"Language", value:"English (IN)", status:"Enabled" },
      { name:"Theme Mode", category:"Theme", value:"System", status:"Enabled" },
      { name:"Larger Text", category:"Accessibility", value:"Off", status:"Disabled" },
      { name:"Reduce Motion", category:"Accessibility", value:"On", status:"Enabled" },
    ],
  },
};

export function getTeacherModuleSchema(slug: string): ModuleSchema | null {
  return TMS[slug] ?? null;
}
