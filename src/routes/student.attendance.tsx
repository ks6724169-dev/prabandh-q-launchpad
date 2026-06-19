import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/student/attendance")({});

const attendanceData = [
  { date: "2025-06-19", day: "Thursday", status: "present", subject: "Mathematics" },
  { date: "2025-06-18", day: "Wednesday", status: "present", subject: "English" },
  { date: "2025-06-17", day: "Tuesday", status: "absent", subject: "Science" },
  { date: "2025-06-16", day: "Monday", status: "present", subject: "History" },
  { date: "2025-06-15", day: "Sunday", status: "holiday", subject: "Holiday" },
  { date: "2025-06-14", day: "Saturday", status: "present", subject: "Physical Ed" },
];

export default function StudentAttendance() {
  const presentCount = attendanceData.filter((a) => a.status === "present").length;
  const totalDays = attendanceData.filter((a) => a.status !== "holiday").length;
  const percentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="mt-1 text-muted-foreground">Track your attendance percentage and history</p>
      </div>

      {/* Attendance Summary */}
      <Card className="p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Overall Attendance</p>
            <p className="mt-2 text-4xl font-bold text-green-600">{percentage}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Present Days</p>
            <p className="mt-2 text-4xl font-bold text-blue-600">{presentCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Days</p>
            <p className="mt-2 text-4xl font-bold text-gray-600">{totalDays}</p>
          </div>
        </div>
      </Card>

      {/* Attendance List */}
      <Card className="overflow-hidden">
        <div className="border-b border-border bg-card p-4">
          <h3 className="font-bold">Attendance History</h3>
        </div>
        <div className="divide-y divide-border">
          {attendanceData.map((record, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 hover:bg-accent/50">
              <div className="flex-1">
                <p className="font-medium">{record.day}, {record.date}</p>
                <p className="text-sm text-muted-foreground">{record.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                {record.status === "present" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Present</span>
                  </>
                )}
                {record.status === "absent" && (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-600">Absent</span>
                  </>
                )}
                {record.status === "holiday" && (
                  <span className="text-sm font-medium text-gray-500">Holiday</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
