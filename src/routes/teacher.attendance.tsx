import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export const Route = createFileRoute("/teacher/attendance")({});

const studentList = [
  { id: 1, name: "Aarav Singh", roll: "A001", status: "present" },
  { id: 2, name: "Bhavna Sharma", roll: "A002", status: "present" },
  { id: 3, name: "Chitra Patel", roll: "A003", status: "absent" },
  { id: 4, name: "Deepak Kumar", roll: "A004", status: "present" },
  { id: 5, name: "Esha Gupta", roll: "A005", status: "present" },
  { id: 6, name: "Fatima Khan", roll: "A006", status: "absent" },
];

export default function MarkAttendance() {
  const [attendance, setAttendance] = useState(
    studentList.reduce(
      (acc, s) => ({ ...acc, [s.id]: s.status === "present" }),
      {} as Record<number, boolean>
    )
  );

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="mt-1 text-muted-foreground">Class XII-A | June 19, 2025</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="font-bold">Attendance Status: {presentCount}/{studentList.length} Present</p>
          <Button className="bg-gradient-hero text-primary-foreground">Submit Attendance</Button>
        </div>
      </Card>

      {/* Attendance Checklist */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-card p-4">
          <h3 className="font-bold">Student Checklist</h3>
        </div>
        <div className="divide-y divide-border">
          {studentList.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={attendance[student.id]}
                  onCheckedChange={(checked) =>
                    setAttendance({ ...attendance, [student.id]: checked === true })
                  }
                />
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">Roll: {student.roll}</p>
                </div>
              </div>
              <span
                className={`text-sm font-medium ${
                  attendance[student.id] ? "text-green-600" : "text-red-600"
                }`}
              >
                {attendance[student.id] ? "✓ Present" : "✗ Absent"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
