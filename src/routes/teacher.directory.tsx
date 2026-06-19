import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/teacher/directory")({});

const studentDirectory = [
  { id: 1, name: "Aarav Singh", roll: "A001", email: "aarav@mail.com", phone: "98765-43210", class: "XII-A" },
  { id: 2, name: "Bhavna Sharma", roll: "A002", email: "bhavna@mail.com", phone: "98765-43211", class: "XII-A" },
  { id: 3, name: "Chitra Patel", roll: "A003", email: "chitra@mail.com", phone: "98765-43212", class: "XII-A" },
  { id: 4, name: "Deepak Kumar", roll: "A004", email: "deepak@mail.com", phone: "98765-43213", class: "XII-B" },
  { id: 5, name: "Esha Gupta", roll: "A005", email: "esha@mail.com", phone: "98765-43214", class: "XII-B" },
  { id: 6, name: "Fatima Khan", roll: "A006", email: "fatima@mail.com", phone: "98765-43215", class: "XI-A" },
];

export default function StudentDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = studentDirectory.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Student Directory</h1>
        <p className="mt-1 text-muted-foreground">Search and view student contact information</p>
      </div>

      <Card className="p-4">
        <Input
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=""
        />
      </Card>

      {/* Student List */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-card p-4">
          <h3 className="font-bold">Students ({filteredStudents.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-4 hover:bg-accent/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Roll: {student.roll} | Class: {student.class}
                  </p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {student.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {student.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
