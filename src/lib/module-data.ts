// Per-module schemas + realistic demo seed data for the 30 enterprise modules.
// Keeps a single shape so one shared FunctionalModule component can render any module.

export type FieldType = "text" | "number" | "select" | "date" | "email" | "tel";

export type ModuleField = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type StatDef = {
  label: string;
  /** function over the row list, OR a static string. */
  compute: (rows: Record<string, any>[]) => string;
  tone?: "primary" | "emerald" | "amber" | "rose";
};

export type ModuleSchema = {
  /** Title used as record noun. e.g. "Admission" */
  noun: string;
  fields: ModuleField[];
  /** Columns shown in the table (subset of field keys). */
  columns: string[];
  /** Field key used for the free-text search. */
  searchKey: string;
  /** Optional filter dropdown (field key + label). */
  filterKey?: string;
  stats: StatDef[];
  seed: Record<string, any>[];
};

const r = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]) => arr[r(arr.length)];
const date = (offset = 0) => {
  const d = new Date(); d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const FIRST = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Krishna","Ishaan","Ananya","Diya","Saanvi","Aadhya","Myra","Aanya","Pari","Anika","Navya","Kiara","Riya"];
const LAST = ["Sharma","Verma","Patel","Iyer","Reddy","Singh","Kumar","Gupta","Khan","Das","Rao","Nair","Mehta","Joshi","Bose"];
const fullName = () => `${pick(FIRST)} ${pick(LAST)}`;

const CLASSES = ["6-A","7-B","8-A","9-C","10-A","11-Sci","12-Com"];
const SUBJECTS = ["Mathematics","Science","English","History","Physics","Chemistry","Biology","Computer Science"];
const DEPTS = ["Administration","Academics","Maintenance","Finance","Library","Sports","IT","Transport"];

function seed<T>(n: number, factory: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => factory(i));
}

const MS: Record<string, ModuleSchema> = {
  /* 2. Admissions */
  "admissions-mgmt": {
    noun: "Admission",
    fields: [
      { key: "name", label: "Applicant Name", type: "text", required: true },
      { key: "klass", label: "Class Applied", type: "select", options: CLASSES, required: true },
      { key: "stage", label: "Stage", type: "select", options: ["Applied","Documents","Interview","Approved","Rejected"], required: true },
      { key: "score", label: "Entrance Score", type: "number" },
      { key: "appliedOn", label: "Applied On", type: "date" },
    ],
    columns: ["name","klass","stage","score","appliedOn"],
    searchKey: "name", filterKey: "stage",
    stats: [
      { label: "Total Applications", compute: (r) => r.length.toString(), tone: "primary" },
      { label: "Approved", compute: (r) => r.filter(x=>x.stage==="Approved").length.toString(), tone: "emerald" },
      { label: "In Review", compute: (r) => r.filter(x=>["Documents","Interview"].includes(x.stage)).length.toString(), tone: "amber" },
      { label: "Avg. Score", compute: (r) => Math.round(r.reduce((a,b)=>a+(b.score||0),0)/Math.max(r.length,1)).toString() },
    ],
    seed: seed(18, () => ({
      name: fullName(), klass: pick(CLASSES),
      stage: pick(["Applied","Documents","Interview","Approved","Approved","Rejected"]),
      score: 55 + r(45), appliedOn: date(r(60)),
    })),
  },

  /* 3. Students */
  "students": {
    noun: "Student",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "roll", label: "Roll No.", type: "text" },
      { key: "guardian", label: "Guardian", type: "text" },
      { key: "phone", label: "Phone", type: "tel" },
    ],
    columns: ["name","klass","roll","guardian","phone"],
    searchKey: "name", filterKey: "klass",
    stats: [
      { label: "Enrolled", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Boys", compute: (r)=>Math.round(r.length*0.52).toString() },
      { label: "Girls", compute: (r)=>Math.round(r.length*0.48).toString() },
      { label: "Classes Active", compute: (r)=>new Set(r.map(x=>x.klass)).size.toString(), tone:"emerald" },
    ],
    seed: seed(24, (i) => ({
      name: fullName(), klass: pick(CLASSES), roll: String(1001+i),
      guardian: fullName(), phone: "98" + r(100000000).toString().padStart(8,"0"),
    })),
  },

  /* 4. Attendance */
  "attendance-mgmt": {
    noun: "Attendance Entry",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "status", label: "Status", type: "select", options: ["Present","Absent","Late","Excused"], required: true },
      { key: "date", label: "Date", type: "date", required: true },
    ],
    columns: ["name","klass","status","date"],
    searchKey: "name", filterKey: "status",
    stats: [
      { label: "Today's Present", compute: (r)=>r.filter(x=>x.status==="Present").length.toString(), tone:"emerald" },
      { label: "Absent", compute: (r)=>r.filter(x=>x.status==="Absent").length.toString(), tone:"rose" },
      { label: "Late", compute: (r)=>r.filter(x=>x.status==="Late").length.toString(), tone:"amber" },
      { label: "Attendance %", compute: (r)=>Math.round((r.filter(x=>x.status==="Present").length/Math.max(r.length,1))*100)+"%", tone:"primary" },
    ],
    seed: seed(30, () => ({
      name: fullName(), klass: pick(CLASSES),
      status: pick(["Present","Present","Present","Present","Absent","Late","Excused"]),
      date: date(r(7)),
    })),
  },

  /* 5. Academics */
  "academics": {
    noun: "Class",
    fields: [
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "teacher", label: "Teacher", type: "text" },
      { key: "progress", label: "Syllabus %", type: "number" },
    ],
    columns: ["klass","subject","teacher","progress"],
    searchKey: "subject", filterKey: "klass",
    stats: [
      { label: "Total Classes", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Avg Syllabus", compute: (r)=>Math.round(r.reduce((a,b)=>a+(+b.progress||0),0)/Math.max(r.length,1))+"%", tone:"emerald" },
      { label: "Subjects", compute: (r)=>new Set(r.map(x=>x.subject)).size.toString() },
      { label: "Teachers", compute: (r)=>new Set(r.map(x=>x.teacher)).size.toString() },
    ],
    seed: seed(20, () => ({ klass: pick(CLASSES), subject: pick(SUBJECTS), teacher: fullName(), progress: 30 + r(70) })),
  },

  /* 6. Exams */
  "exams": {
    noun: "Exam",
    fields: [
      { key: "title", label: "Exam Title", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "maxMarks", label: "Max Marks", type: "number" },
    ],
    columns: ["title","klass","subject","date","maxMarks"],
    searchKey: "title", filterKey: "klass",
    stats: [
      { label: "Scheduled", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "This Week", compute: (r)=>r.filter(x=>{const d=new Date(x.date); const n=new Date(); return (d.getTime()-n.getTime())/86400000<7;}).length.toString(), tone:"amber" },
      { label: "Subjects", compute: (r)=>new Set(r.map(x=>x.subject)).size.toString() },
      { label: "Avg Max Marks", compute: (r)=>Math.round(r.reduce((a,b)=>a+(+b.maxMarks||0),0)/Math.max(r.length,1)).toString() },
    ],
    seed: seed(16, () => ({ title: pick(["Unit Test","Mid Term","Quarterly","Final"])+ " " + pick(SUBJECTS), klass: pick(CLASSES), subject: pick(SUBJECTS), date: date(-r(30)), maxMarks: pick([50,80,100]) })),
  },

  /* 7. Homework */
  "homework": {
    noun: "Assignment",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "dueDate", label: "Due Date", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Open","Submitted","Graded","Overdue"] },
    ],
    columns: ["title","klass","subject","dueDate","status"],
    searchKey: "title", filterKey: "status",
    stats: [
      { label: "Active", compute: (r)=>r.filter(x=>x.status==="Open").length.toString(), tone:"primary" },
      { label: "Submitted", compute: (r)=>r.filter(x=>x.status==="Submitted").length.toString(), tone:"emerald" },
      { label: "Graded", compute: (r)=>r.filter(x=>x.status==="Graded").length.toString() },
      { label: "Overdue", compute: (r)=>r.filter(x=>x.status==="Overdue").length.toString(), tone:"rose" },
    ],
    seed: seed(20, () => ({ title: pick(["Chapter Exercises","Worksheet","Project","Lab Report"]), klass: pick(CLASSES), subject: pick(SUBJECTS), dueDate: date(-r(10)), status: pick(["Open","Submitted","Graded","Overdue"]) })),
  },

  /* 8. Timetable */
  "timetable": {
    noun: "Period",
    fields: [
      { key: "day", label: "Day", type: "select", options: ["Mon","Tue","Wed","Thu","Fri","Sat"], required: true },
      { key: "period", label: "Period", type: "select", options: ["1","2","3","4","5","6","7","8"], required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES, required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS },
      { key: "teacher", label: "Teacher", type: "text" },
    ],
    columns: ["day","period","klass","subject","teacher"],
    searchKey: "teacher", filterKey: "day",
    stats: [
      { label: "Periods", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Classes", compute: (r)=>new Set(r.map(x=>x.klass)).size.toString() },
      { label: "Teachers", compute: (r)=>new Set(r.map(x=>x.teacher)).size.toString(), tone:"emerald" },
      { label: "Conflicts", compute: ()=>"0", tone:"emerald" },
    ],
    seed: seed(24, () => ({ day: pick(["Mon","Tue","Wed","Thu","Fri","Sat"]), period: String(1+r(8)), klass: pick(CLASSES), subject: pick(SUBJECTS), teacher: fullName() })),
  },

  /* 10. Accounting */
  "accounting": {
    noun: "Ledger Entry",
    fields: [
      { key: "head", label: "Account Head", type: "select", options: ["Tuition","Salary","Utilities","Supplies","Maintenance","Transport","Other"], required: true },
      { key: "type", label: "Type", type: "select", options: ["Income","Expense"], required: true },
      { key: "amount", label: "Amount (₹)", type: "number", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "note", label: "Note", type: "text" },
    ],
    columns: ["head","type","amount","date","note"],
    searchKey: "head", filterKey: "type",
    stats: [
      { label: "Income", compute: (r)=>inr(r.filter(x=>x.type==="Income").reduce((a,b)=>a+(+b.amount||0),0)), tone:"emerald" },
      { label: "Expense", compute: (r)=>inr(r.filter(x=>x.type==="Expense").reduce((a,b)=>a+(+b.amount||0),0)), tone:"rose" },
      { label: "Net", compute: (r)=>inr(r.reduce((a,b)=>a+(b.type==="Income"?1:-1)*(+b.amount||0),0)), tone:"primary" },
      { label: "Entries", compute: (r)=>r.length.toString() },
    ],
    seed: seed(20, () => {
      const type = pick(["Income","Expense"]); return { head: pick(["Tuition","Salary","Utilities","Supplies","Maintenance","Transport"]), type, amount: 5000 + r(95000), date: date(r(45)), note: pick(["Monthly","Adhoc","Vendor PO","UPI ref","Bank Txn"]) };
    }),
  },

  /* 11. Teachers */
  "teachers": {
    noun: "Teacher",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "subject", label: "Subject", type: "select", options: SUBJECTS, required: true },
      { key: "experience", label: "Experience (yrs)", type: "number" },
      { key: "email", label: "Email", type: "email" },
      { key: "phone", label: "Phone", type: "tel" },
    ],
    columns: ["name","subject","experience","email","phone"],
    searchKey: "name", filterKey: "subject",
    stats: [
      { label: "Total Teachers", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Avg Experience", compute: (r)=>Math.round(r.reduce((a,b)=>a+(+b.experience||0),0)/Math.max(r.length,1))+" yrs" },
      { label: "Subjects Covered", compute: (r)=>new Set(r.map(x=>x.subject)).size.toString(), tone:"emerald" },
      { label: "Email Verified", compute: (r)=>r.length.toString() },
    ],
    seed: seed(16, () => { const n = fullName(); return { name: n, subject: pick(SUBJECTS), experience: 1+r(20), email: n.toLowerCase().replace(/ /,".")+"@school.edu", phone: "98"+r(100000000).toString().padStart(8,"0") }; }),
  },

  /* 12. Staff */
  "staff-mgmt": {
    noun: "Staff",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "department", label: "Department", type: "select", options: DEPTS, required: true },
      { key: "designation", label: "Designation", type: "text" },
      { key: "shift", label: "Shift", type: "select", options: ["Morning","Afternoon","Night"] },
    ],
    columns: ["name","department","designation","shift"],
    searchKey: "name", filterKey: "department",
    stats: [
      { label: "Total Staff", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Departments", compute: (r)=>new Set(r.map(x=>x.department)).size.toString() },
      { label: "Morning Shift", compute: (r)=>r.filter(x=>x.shift==="Morning").length.toString(), tone:"emerald" },
      { label: "Night Shift", compute: (r)=>r.filter(x=>x.shift==="Night").length.toString() },
    ],
    seed: seed(18, () => ({ name: fullName(), department: pick(DEPTS), designation: pick(["Officer","Assistant","Supervisor","Clerk","Coordinator"]), shift: pick(["Morning","Afternoon","Night"]) })),
  },

  /* 13. Payroll */
  "payroll": {
    noun: "Payslip",
    fields: [
      { key: "name", label: "Employee", type: "text", required: true },
      { key: "month", label: "Month", type: "text", placeholder: "e.g. Jun 2026", required: true },
      { key: "gross", label: "Gross (₹)", type: "number", required: true },
      { key: "deductions", label: "Deductions (₹)", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Draft","Processed","Paid"] },
    ],
    columns: ["name","month","gross","deductions","status"],
    searchKey: "name", filterKey: "status",
    stats: [
      { label: "Payslips", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Paid", compute: (r)=>r.filter(x=>x.status==="Paid").length.toString(), tone:"emerald" },
      { label: "Gross Total", compute: (r)=>inr(r.reduce((a,b)=>a+(+b.gross||0),0)) },
      { label: "Net Total", compute: (r)=>inr(r.reduce((a,b)=>a+(+b.gross||0)-(+b.deductions||0),0)), tone:"emerald" },
    ],
    seed: seed(15, () => ({ name: fullName(), month: "Jun 2026", gross: 30000 + r(50000), deductions: 1000 + r(8000), status: pick(["Draft","Processed","Paid","Paid"]) })),
  },

  /* 14. Parents */
  "parents": {
    noun: "Parent",
    fields: [
      { key: "name", label: "Parent Name", type: "text", required: true },
      { key: "child", label: "Child", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "phone", label: "Phone", type: "tel" },
      { key: "email", label: "Email", type: "email" },
    ],
    columns: ["name","child","klass","phone","email"],
    searchKey: "name", filterKey: "klass",
    stats: [
      { label: "Registered Parents", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "WhatsApp Linked", compute: (r)=>Math.round(r.length*0.92).toString(), tone:"emerald" },
      { label: "Open Tickets", compute: ()=>"4", tone:"amber" },
      { label: "Meetings Scheduled", compute: ()=>"7" },
    ],
    seed: seed(20, () => { const n=fullName(); return { name: n, child: fullName(), klass: pick(CLASSES), phone: "98"+r(100000000).toString().padStart(8,"0"), email: n.toLowerCase().replace(/ /,".")+"@parents.com" }; }),
  },

  /* 15. Communication */
  "communication": {
    noun: "Message",
    fields: [
      { key: "subject", label: "Subject", type: "text", required: true },
      { key: "channel", label: "Channel", type: "select", options: ["SMS","Email","WhatsApp","Push"], required: true },
      { key: "audience", label: "Audience", type: "select", options: ["All Parents","Class","Staff","Students"] },
      { key: "status", label: "Status", type: "select", options: ["Draft","Scheduled","Sent"] },
      { key: "sentOn", label: "Sent On", type: "date" },
    ],
    columns: ["subject","channel","audience","status","sentOn"],
    searchKey: "subject", filterKey: "channel",
    stats: [
      { label: "Sent (30d)", compute: (r)=>r.filter(x=>x.status==="Sent").length.toString(), tone:"primary" },
      { label: "WhatsApp", compute: (r)=>r.filter(x=>x.channel==="WhatsApp").length.toString(), tone:"emerald" },
      { label: "Scheduled", compute: (r)=>r.filter(x=>x.status==="Scheduled").length.toString(), tone:"amber" },
      { label: "Delivery", compute: ()=>"98%", tone:"emerald" },
    ],
    seed: seed(18, () => ({ subject: pick(["Holiday Notice","PTM Reminder","Fee Due","Exam Schedule","Result Out"]), channel: pick(["SMS","Email","WhatsApp","Push"]), audience: pick(["All Parents","Class","Staff","Students"]), status: pick(["Draft","Scheduled","Sent","Sent"]), sentOn: date(r(30)) })),
  },

  /* 16. Transport */
  "transport": {
    noun: "Route",
    fields: [
      { key: "route", label: "Route Name", type: "text", required: true },
      { key: "vehicle", label: "Vehicle No.", type: "text" },
      { key: "driver", label: "Driver", type: "text" },
      { key: "stops", label: "Stops", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Active","Maintenance","Delayed"] },
    ],
    columns: ["route","vehicle","driver","stops","status"],
    searchKey: "route", filterKey: "status",
    stats: [
      { label: "Routes", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Active", compute: (r)=>r.filter(x=>x.status==="Active").length.toString(), tone:"emerald" },
      { label: "Delayed", compute: (r)=>r.filter(x=>x.status==="Delayed").length.toString(), tone:"amber" },
      { label: "Total Stops", compute: (r)=>r.reduce((a,b)=>a+(+b.stops||0),0).toString() },
    ],
    seed: seed(12, (i) => ({ route: `Route ${i+1} - ${pick(["North","South","East","West","Central"])}`, vehicle: "DL "+(10+r(40))+" "+pick(["A","B","C"])+" "+(1000+r(8999)), driver: fullName(), stops: 5+r(15), status: pick(["Active","Active","Active","Maintenance","Delayed"]) })),
  },

  /* 17. Hostel */
  "hostel": {
    noun: "Room",
    fields: [
      { key: "room", label: "Room No.", type: "text", required: true },
      { key: "block", label: "Block", type: "select", options: ["A","B","C","D"] },
      { key: "capacity", label: "Capacity", type: "number" },
      { key: "occupied", label: "Occupied", type: "number" },
      { key: "warden", label: "Warden", type: "text" },
    ],
    columns: ["room","block","capacity","occupied","warden"],
    searchKey: "room", filterKey: "block",
    stats: [
      { label: "Rooms", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Beds Total", compute: (r)=>r.reduce((a,b)=>a+(+b.capacity||0),0).toString() },
      { label: "Occupied", compute: (r)=>r.reduce((a,b)=>a+(+b.occupied||0),0).toString(), tone:"emerald" },
      { label: "Vacancy", compute: (r)=>(r.reduce((a,b)=>a+(+b.capacity||0)-(+b.occupied||0),0)).toString(), tone:"amber" },
    ],
    seed: seed(16, (i) => ({ room: `R-${101+i}`, block: pick(["A","B","C","D"]), capacity: pick([2,3,4]), occupied: r(4), warden: fullName() })),
  },

  /* 18. Library */
  "library": {
    noun: "Book",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "author", label: "Author", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["Fiction","Science","Math","History","Reference","Biography"] },
      { key: "copies", label: "Copies", type: "number" },
      { key: "available", label: "Available", type: "number" },
    ],
    columns: ["title","author","category","copies","available"],
    searchKey: "title", filterKey: "category",
    stats: [
      { label: "Titles", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Total Copies", compute: (r)=>r.reduce((a,b)=>a+(+b.copies||0),0).toString() },
      { label: "Available", compute: (r)=>r.reduce((a,b)=>a+(+b.available||0),0).toString(), tone:"emerald" },
      { label: "On Loan", compute: (r)=>r.reduce((a,b)=>a+(+b.copies||0)-(+b.available||0),0).toString() },
    ],
    seed: seed(20, () => { const c=2+r(8); return { title: pick(["Wings of Fire","Discovery of India","Sapiens","The Alchemist","Brief History of Time","Atomic Habits","Panchatantra","Calculus","Physics XII"]), author: fullName(), category: pick(["Fiction","Science","Math","History","Reference","Biography"]), copies: c, available: r(c+1) }; }),
  },

  /* 19. Inventory */
  "inventory": {
    noun: "Asset",
    fields: [
      { key: "item", label: "Item", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["Furniture","Electronics","Stationery","Lab","Sports"] },
      { key: "qty", label: "Quantity", type: "number" },
      { key: "minQty", label: "Min Qty", type: "number" },
      { key: "location", label: "Location", type: "text" },
    ],
    columns: ["item","category","qty","minQty","location"],
    searchKey: "item", filterKey: "category",
    stats: [
      { label: "SKUs", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Low Stock", compute: (r)=>r.filter(x=>(+x.qty)<=(+x.minQty)).length.toString(), tone:"rose" },
      { label: "Categories", compute: (r)=>new Set(r.map(x=>x.category)).size.toString() },
      { label: "Total Units", compute: (r)=>r.reduce((a,b)=>a+(+b.qty||0),0).toString(), tone:"emerald" },
    ],
    seed: seed(20, () => ({ item: pick(["Desk","Chair","Projector","Whiteboard","Marker","Test Tube","Football","Tablet","Printer"]), category: pick(["Furniture","Electronics","Stationery","Lab","Sports"]), qty: r(50), minQty: 5+r(10), location: pick(["Store A","Store B","Lab","Office","Sports Room"]) })),
  },

  /* 20. Health */
  "health": {
    noun: "Health Record",
    fields: [
      { key: "name", label: "Student", type: "text", required: true },
      { key: "klass", label: "Class", type: "select", options: CLASSES },
      { key: "issue", label: "Issue", type: "text" },
      { key: "severity", label: "Severity", type: "select", options: ["Low","Medium","High"] },
      { key: "date", label: "Date", type: "date" },
    ],
    columns: ["name","klass","issue","severity","date"],
    searchKey: "name", filterKey: "severity",
    stats: [
      { label: "Records", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "High Severity", compute: (r)=>r.filter(x=>x.severity==="High").length.toString(), tone:"rose" },
      { label: "Vaccinated", compute: (r)=>Math.round(r.length*0.95).toString(), tone:"emerald" },
      { label: "Infirmary Visits", compute: (r)=>r.length.toString() },
    ],
    seed: seed(15, () => ({ name: fullName(), klass: pick(CLASSES), issue: pick(["Fever","Cold","Headache","Injury","Allergy","Stomach Ache"]), severity: pick(["Low","Low","Medium","High"]), date: date(r(30)) })),
  },

  /* 21. Events */
  "events": {
    noun: "Event",
    fields: [
      { key: "title", label: "Event", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Academic","Cultural","Sports","Holiday","PTM"] },
      { key: "date", label: "Date", type: "date" },
      { key: "venue", label: "Venue", type: "text" },
      { key: "budget", label: "Budget (₹)", type: "number" },
    ],
    columns: ["title","type","date","venue","budget"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Upcoming", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "This Month", compute: (r)=>r.filter(x=>new Date(x.date).getMonth()===new Date().getMonth()).length.toString(), tone:"emerald" },
      { label: "Total Budget", compute: (r)=>inr(r.reduce((a,b)=>a+(+b.budget||0),0)) },
      { label: "Types", compute: (r)=>new Set(r.map(x=>x.type)).size.toString() },
    ],
    seed: seed(10, () => ({ title: pick(["Annual Day","Sports Meet","Science Fair","Diwali Holiday","PTM Q2","Independence Day"]), type: pick(["Academic","Cultural","Sports","Holiday","PTM"]), date: date(-r(40)), venue: pick(["Auditorium","Ground","Hall","Classroom"]), budget: 5000+r(95000) })),
  },

  /* 22. Visitors */
  "visitors": {
    noun: "Visitor",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "purpose", label: "Purpose", type: "text" },
      { key: "host", label: "Meeting With", type: "text" },
      { key: "inTime", label: "In Time", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["Checked-in","Checked-out"] },
    ],
    columns: ["name","purpose","host","inTime","status"],
    searchKey: "name", filterKey: "status",
    stats: [
      { label: "Today", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Inside", compute: (r)=>r.filter(x=>x.status==="Checked-in").length.toString(), tone:"amber" },
      { label: "Checked-out", compute: (r)=>r.filter(x=>x.status==="Checked-out").length.toString(), tone:"emerald" },
      { label: "Alerts", compute: ()=>"0", tone:"emerald" },
    ],
    seed: seed(12, () => ({ name: fullName(), purpose: pick(["Parent Meeting","Vendor","Interview","Inspection","Delivery"]), host: fullName(), inTime: `${9+r(8)}:${r(6)}0`, status: pick(["Checked-in","Checked-out","Checked-out"]) })),
  },

  /* 23. Security */
  "security": {
    noun: "Role",
    fields: [
      { key: "name", label: "Role Name", type: "text", required: true },
      { key: "users", label: "Users", type: "number" },
      { key: "scope", label: "Scope", type: "select", options: ["Global","School","Class","Self"] },
      { key: "lastAudit", label: "Last Audit", type: "date" },
    ],
    columns: ["name","users","scope","lastAudit"],
    searchKey: "name", filterKey: "scope",
    stats: [
      { label: "Roles", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Active Users", compute: (r)=>r.reduce((a,b)=>a+(+b.users||0),0).toString(), tone:"emerald" },
      { label: "Audit Logs (7d)", compute: ()=>"1,284" },
      { label: "Suspicious", compute: ()=>"0", tone:"emerald" },
    ],
    seed: [
      { name:"Super Admin", users:2, scope:"Global", lastAudit:date(2) },
      { name:"Principal", users:1, scope:"School", lastAudit:date(5) },
      { name:"Teacher", users:24, scope:"Class", lastAudit:date(1) },
      { name:"Accountant", users:3, scope:"School", lastAudit:date(7) },
      { name:"Librarian", users:2, scope:"School", lastAudit:date(10) },
      { name:"Parent", users:480, scope:"Self", lastAudit:date(1) },
      { name:"Student", users:520, scope:"Self", lastAudit:date(1) },
    ],
  },

  /* 24. Reports */
  "reports": {
    noun: "Report",
    fields: [
      { key: "title", label: "Report", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["Academic","Financial","Attendance","HR","Custom"] },
      { key: "lastRun", label: "Last Run", type: "date" },
      { key: "format", label: "Format", type: "select", options: ["PDF","Excel","CSV"] },
    ],
    columns: ["title","category","lastRun","format"],
    searchKey: "title", filterKey: "category",
    stats: [
      { label: "Templates", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Run This Month", compute: ()=>"68", tone:"emerald" },
      { label: "Scheduled", compute: ()=>"12", tone:"amber" },
      { label: "Categories", compute: (r)=>new Set(r.map(x=>x.category)).size.toString() },
    ],
    seed: seed(12, (i) => ({ title: pick(["Term Result","Fee Collection","Attendance Summary","Teacher Workload","Inventory Audit","Bus Utilization"])+ " #" + (i+1), category: pick(["Academic","Financial","Attendance","HR","Custom"]), lastRun: date(r(15)), format: pick(["PDF","Excel","CSV"]) })),
  },

  /* 25. Documents */
  "documents": {
    noun: "Document",
    fields: [
      { key: "name", label: "Document", type: "text", required: true },
      { key: "category", label: "Category", type: "select", options: ["Certificate","ID","Marksheet","Policy","Contract"] },
      { key: "owner", label: "Owner", type: "text" },
      { key: "size", label: "Size (KB)", type: "number" },
      { key: "uploaded", label: "Uploaded", type: "date" },
    ],
    columns: ["name","category","owner","size","uploaded"],
    searchKey: "name", filterKey: "category",
    stats: [
      { label: "Files", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Signed (eSign)", compute: (r)=>Math.round(r.length*0.4).toString(), tone:"emerald" },
      { label: "Storage (MB)", compute: (r)=>Math.round(r.reduce((a,b)=>a+(+b.size||0),0)/1024).toString() },
      { label: "Categories", compute: (r)=>new Set(r.map(x=>x.category)).size.toString() },
    ],
    seed: seed(18, () => ({ name: pick(["TC","Birth Cert","Aadhaar","Marksheet","Policy v3","NDA","Vendor Contract"])+".pdf", category: pick(["Certificate","ID","Marksheet","Policy","Contract"]), owner: fullName(), size: 100+r(2000), uploaded: date(r(60)) })),
  },

  /* 26. Mobile App Control */
  "mobile-app": {
    noun: "App Setting",
    fields: [
      { key: "feature", label: "Feature Flag", type: "text", required: true },
      { key: "platform", label: "Platform", type: "select", options: ["iOS","Android","Both"] },
      { key: "state", label: "State", type: "select", options: ["Enabled","Disabled","Beta"] },
      { key: "rollout", label: "Rollout %", type: "number" },
    ],
    columns: ["feature","platform","state","rollout"],
    searchKey: "feature", filterKey: "state",
    stats: [
      { label: "Flags", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Enabled", compute: (r)=>r.filter(x=>x.state==="Enabled").length.toString(), tone:"emerald" },
      { label: "In Beta", compute: (r)=>r.filter(x=>x.state==="Beta").length.toString(), tone:"amber" },
      { label: "App Installs", compute: ()=>"1,820" },
    ],
    seed: [
      { feature:"Parent Chat", platform:"Both", state:"Enabled", rollout:100 },
      { feature:"Live Bus Track", platform:"Android", state:"Beta", rollout:35 },
      { feature:"Face Attendance", platform:"iOS", state:"Beta", rollout:20 },
      { feature:"Dark Mode", platform:"Both", state:"Enabled", rollout:100 },
      { feature:"Voice Notes", platform:"Both", state:"Disabled", rollout:0 },
      { feature:"Offline Mode", platform:"Android", state:"Enabled", rollout:80 },
    ],
  },

  /* 27. CMS */
  "cms": {
    noun: "Page / Post",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Page","News","Notice","Event"] },
      { key: "status", label: "Status", type: "select", options: ["Draft","Published","Scheduled"] },
      { key: "author", label: "Author", type: "text" },
      { key: "updated", label: "Updated", type: "date" },
    ],
    columns: ["title","type","status","author","updated"],
    searchKey: "title", filterKey: "type",
    stats: [
      { label: "Pages", compute: (r)=>r.filter(x=>x.type==="Page").length.toString(), tone:"primary" },
      { label: "Published", compute: (r)=>r.filter(x=>x.status==="Published").length.toString(), tone:"emerald" },
      { label: "Drafts", compute: (r)=>r.filter(x=>x.status==="Draft").length.toString(), tone:"amber" },
      { label: "Visitors (30d)", compute: ()=>"12.4k" },
    ],
    seed: seed(14, () => ({ title: pick(["Home","About","Admissions","Notice","Annual Day","Achievements","Contact","Faculty"]), type: pick(["Page","News","Notice","Event"]), status: pick(["Draft","Published","Published","Scheduled"]), author: fullName(), updated: date(r(20)) })),
  },

  /* 28. AI Command Center is bespoke (handled separately) */

  /* 29. Integrations */
  "integrations": {
    noun: "Integration",
    fields: [
      { key: "name", label: "Service", type: "text", required: true },
      { key: "type", label: "Type", type: "select", options: ["Payment","Messaging","Biometric","GPS","Conferencing"] },
      { key: "status", label: "Status", type: "select", options: ["Connected","Disconnected","Error"] },
      { key: "lastSync", label: "Last Sync", type: "date" },
    ],
    columns: ["name","type","status","lastSync"],
    searchKey: "name", filterKey: "status",
    stats: [
      { label: "Total", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Connected", compute: (r)=>r.filter(x=>x.status==="Connected").length.toString(), tone:"emerald" },
      { label: "Errors", compute: (r)=>r.filter(x=>x.status==="Error").length.toString(), tone:"rose" },
      { label: "Synced Today", compute: ()=>"5", tone:"emerald" },
    ],
    seed: [
      { name:"Razorpay", type:"Payment", status:"Connected", lastSync:date(0) },
      { name:"Stripe", type:"Payment", status:"Disconnected", lastSync:date(20) },
      { name:"Twilio SMS", type:"Messaging", status:"Connected", lastSync:date(0) },
      { name:"WhatsApp Business", type:"Messaging", status:"Connected", lastSync:date(1) },
      { name:"Mantra Biometric", type:"Biometric", status:"Connected", lastSync:date(0) },
      { name:"Onelap GPS", type:"GPS", status:"Error", lastSync:date(3) },
      { name:"Google Meet", type:"Conferencing", status:"Connected", lastSync:date(0) },
      { name:"Zoom", type:"Conferencing", status:"Connected", lastSync:date(2) },
    ],
  },

  /* 30. Multi-School */
  "multi-school": {
    noun: "Branch",
    fields: [
      { key: "name", label: "Branch Name", type: "text", required: true },
      { key: "city", label: "City", type: "text" },
      { key: "students", label: "Students", type: "number" },
      { key: "staff", label: "Staff", type: "number" },
      { key: "rating", label: "Rating (1-5)", type: "number" },
    ],
    columns: ["name","city","students","staff","rating"],
    searchKey: "name", filterKey: "city",
    stats: [
      { label: "Branches", compute: (r)=>r.length.toString(), tone:"primary" },
      { label: "Total Students", compute: (r)=>r.reduce((a,b)=>a+(+b.students||0),0).toLocaleString("en-IN"), tone:"emerald" },
      { label: "Total Staff", compute: (r)=>r.reduce((a,b)=>a+(+b.staff||0),0).toString() },
      { label: "Avg Rating", compute: (r)=>(r.reduce((a,b)=>a+(+b.rating||0),0)/Math.max(r.length,1)).toFixed(1) },
    ],
    seed: [
      { name:"Prabandh Q - HQ", city:"Delhi", students:1240, staff:96, rating:4.7 },
      { name:"Prabandh Q - Noida", city:"Noida", students:840, staff:64, rating:4.6 },
      { name:"Prabandh Q - Gurgaon", city:"Gurgaon", students:710, staff:58, rating:4.5 },
      { name:"Prabandh Q - Mumbai", city:"Mumbai", students:980, staff:72, rating:4.8 },
      { name:"Prabandh Q - Pune", city:"Pune", students:520, staff:42, rating:4.4 },
      { name:"Prabandh Q - Bangalore", city:"Bangalore", students:1120, staff:88, rating:4.7 },
    ],
  },
};

export function getModuleSchema(slug: string): ModuleSchema | null {
  return MS[slug] ?? null;
}
