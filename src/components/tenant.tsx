import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type InstituteType = "school" | "college";

export type Tenant = {
  id: string | null;
  name: string;
  type: InstituteType;
};

const TenantContext = createContext<Tenant>({
  id: null,
  name: "Demo Institute",
  type: "school",
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant>({
    id: null,
    name: "Demo Institute",
    type: "school",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.localStorage.getItem("pq_institute_id");
    const type = (window.localStorage.getItem("pq_institute_type") as InstituteType) || "school";
    const name = window.localStorage.getItem("pq_institute_name") || "Demo Institute";
    if (id) setTenant({ id, name, type });
  }, []);

  return <TenantContext.Provider value={tenant}>{children}</TenantContext.Provider>;
}

export const useTenant = () => useContext(TenantContext);

/* ---------------------- Shared demo data store (in-memory) ---------------------- */

export type Person = {
  id: string;
  name: string;
  role: "student" | "staff";
  email: string;
  // school
  klass?: string;
  section?: string;
  // college
  course?: string;
  department?: string;
  semester?: string;
};

export type FeeRecord = {
  id: string;
  studentName: string;
  amount: number;
  mode: "Cash" | "UPI" | "Card" | "Bank Transfer";
  date: string;
  receiptNo: string;
};

const uid = () => Math.random().toString(36).slice(2, 10);

const initialPeople: Person[] = [
  { id: uid(), name: "Aarav Sharma", role: "student", email: "aarav@demo.in", klass: "10", section: "A", course: "B.Sc CS", department: "Computer Science", semester: "3" },
  { id: uid(), name: "Diya Verma", role: "student", email: "diya@demo.in", klass: "9", section: "B", course: "B.Com", department: "Commerce", semester: "1" },
  { id: uid(), name: "Rohan Iyer", role: "student", email: "rohan@demo.in", klass: "10", section: "A", course: "B.Sc CS", department: "Computer Science", semester: "3" },
  { id: uid(), name: "Meera Kapoor", role: "staff", email: "meera@demo.in", klass: "—", section: "—", course: "—", department: "Mathematics", semester: "—" },
  { id: uid(), name: "Dr. Anand Rao", role: "staff", email: "anand@demo.in", klass: "—", section: "—", course: "—", department: "Physics", semester: "—" },
];

const initialFees: FeeRecord[] = [
  { id: uid(), studentName: "Aarav Sharma", amount: 12000, mode: "UPI", date: new Date().toLocaleDateString("en-IN"), receiptNo: "PQ-" + uid().toUpperCase() },
];

// Module-level mutable stores — fine for client-only demo state.
let _people = [...initialPeople];
let _fees = [...initialFees];

export function getPeople() { return _people; }
export function setPeopleStore(next: Person[]) { _people = next; }

export function getFees() { return _fees; }
export function setFeesStore(next: FeeRecord[]) { _fees = next; }

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
